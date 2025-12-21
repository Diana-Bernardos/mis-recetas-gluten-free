$server = Start-Process npm -ArgumentList "run start" -WorkingDirectory ".\server" -PassThru
$client = Start-Process npm -ArgumentList "run dev" -WorkingDirectory ".\client" -PassThru

Write-Host "Project started!"
Write-Host "Server running at http://localhost:3000"
Write-Host "Client running at http://localhost:5173"
