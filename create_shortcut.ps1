$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$Home\Desktop\PlaneTicketSystem.lnk")
$Shortcut.TargetPath = "c:\Users\Wen\Downloads\AI工具\plane ticket\start_ticket_system.bat"
$Shortcut.WorkingDirectory = "c:\Users\Wen\Downloads\AI工具\plane ticket"
$Shortcut.IconLocation = "shell32.dll,14"
$Shortcut.Save()
