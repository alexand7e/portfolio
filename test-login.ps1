try {
    $response = Invoke-WebRequest -Uri "http://localhost:7000/admin/login" -UseBasicParsing
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Content Length: $($response.Content.Length)"
    
    # Verificar se contém elementos esperados
    $content = $response.Content
    
    if ($content -match "Painel Administrativo") {
        Write-Host "✅ Título encontrado"
    } else {
        Write-Host "❌ Título NÃO encontrado"
    }
    
    if ($content -match "Email") {
        Write-Host "✅ Campo Email encontrado"
    } else {
        Write-Host "❌ Campo Email NÃO encontrado"
    }
    
    if ($content -match "Senha") {
        Write-Host "✅ Campo Senha encontrado"
    } else {
        Write-Host "❌ Campo Senha NÃO encontrado"
    }
    
    if ($content -match "Entrar") {
        Write-Host "✅ Botão Entrar encontrado"
    } else {
        Write-Host "❌ Botão Entrar NÃO encontrado"
    }
    
    # Salvar HTML para análise
    $content | Out-File -FilePath "login-page.html" -Encoding UTF8
    Write-Host "HTML salvo em login-page.html"
    
} catch {
    Write-Host "Erro: $($_.Exception.Message)"
}
