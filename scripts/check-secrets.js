#!/usr/bin/env node

/**
 * Script para verificar se há credenciais sensíveis expostas no código
 */

const fs = require('fs');
const path = require('path');

// Padrões de credenciais sensíveis
const SENSITIVE_PATTERNS = [
  // URLs de banco de dados
  /postgresql:\/\/[^:]+:[^@]+@[^\/]+\/[^\s"']+/gi,
  /mysql:\/\/[^:]+:[^@]+@[^\/]+\/[^\s"']+/gi,
  /mongodb:\/\/[^:]+:[^@]+@[^\/]+\/[^\s"']+/gi,
  
  // Chaves de API
  /[a-zA-Z0-9]{32,}/g, // Chaves longas
  
  // Emails com senhas
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}:[^@\s]+/g,
  
  // Tokens de acesso
  /[a-zA-Z0-9]{40,}/g,
];

// Arquivos para verificar
const FILES_TO_CHECK = [
  'README.md',
  'env.example',
  'docker.env',
  'package.json',
  'Dockerfile',
  'docker-compose.yml'
];

// Extensões de arquivo para verificar recursivamente
const EXTENSIONS_TO_CHECK = ['.js', '.ts', '.tsx', '.jsx', '.md', '.yml', '.yaml', '.json'];

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    SENSITIVE_PATTERNS.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Filtrar falsos positivos
          if (!isFalsePositive(match)) {
            issues.push({
              pattern: index,
              match: match,
              line: getLineNumber(content, match)
            });
          }
        });
      }
    });
    
    return issues;
  } catch (error) {
    console.error(`Erro ao ler arquivo ${filePath}:`, error.message);
    return [];
  }
}

function isFalsePositive(match) {
  // Filtrar exemplos e placeholders
  const falsePositives = [
    'username:password',
    'your-secret-key-here',
    'your_service_id',
    'your_template_id',
    'your_public_key',
    'admin@exemplo.com',
    'admin@portfolio.com'
  ];
  
  return falsePositives.some(fp => match.includes(fp));
}

function getLineNumber(content, match) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(match)) {
      return i + 1;
    }
  }
  return 0;
}

function checkDirectory(dirPath) {
  const issues = [];
  
  try {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        issues.push(...checkDirectory(filePath));
      } else if (stat.isFile()) {
        const ext = path.extname(file);
        if (EXTENSIONS_TO_CHECK.includes(ext)) {
          const fileIssues = checkFile(filePath);
          fileIssues.forEach(issue => {
            issue.file = filePath;
            issues.push(issue);
          });
        }
      }
    });
  } catch (error) {
    console.error(`Erro ao verificar diretório ${dirPath}:`, error.message);
  }
  
  return issues;
}

function main() {
  console.log('🔍 Verificando credenciais sensíveis...\n');
  
  const allIssues = [];
  
  // Verificar arquivos específicos
  FILES_TO_CHECK.forEach(file => {
    if (fs.existsSync(file)) {
      const issues = checkFile(file);
      issues.forEach(issue => {
        issue.file = file;
        allIssues.push(issue);
      });
    }
  });
  
  // Verificar diretórios recursivamente
  const dirsToCheck = ['app', 'components', 'lib', 'scripts'];
  dirsToCheck.forEach(dir => {
    if (fs.existsSync(dir)) {
      allIssues.push(...checkDirectory(dir));
    }
  });
  
  if (allIssues.length === 0) {
    console.log('✅ Nenhuma credencial sensível encontrada!');
  } else {
    console.log('🚨 CREDENCIAIS SENSÍVEIS ENCONTRADAS:\n');
    
    allIssues.forEach(issue => {
      console.log(`📁 Arquivo: ${issue.file}`);
      console.log(`📍 Linha: ${issue.line}`);
      console.log(`🔍 Match: ${issue.match}`);
      console.log('---');
    });
    
    console.log('\n⚠️  AÇÃO NECESSÁRIA:');
    console.log('1. Remover credenciais reais do código');
    console.log('2. Usar variáveis de ambiente');
    console.log('3. Atualizar credenciais expostas');
    console.log('4. Revisar histórico do Git se necessário');
    
    process.exit(1);
  }
}

main();
