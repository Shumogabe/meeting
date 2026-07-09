export function renderSwitchFileIcon(param) {
  switch (param) {
    case "text/plain":
      return <i class="fas fa-file-alt fa-2x"></i>;
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return <i class="fas fa-file-word fa-2x"></i>;
    case "application/pdf":
      return <i class="fas fa-file-pdf fa-2x"></i>;
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return <i class="fas fa-file-excel fa-2x"></i>;
    case "video/mp4":
      return <i class="fas fa-file-video fa-2x"></i>;
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return <i class="fas fa-file-powerpoint fa-2x"></i>;
    case "image/jpeg":
      return <i class="fas fa-file-image fa-2x"></i>;
    case "image/png":
      return <i class="fas fa-file-image fa-2x"></i>;
    default:
      return <i class="fas fa-file fa-2x"></i>;
  }
}
export function renderSwitchFileType(param) {
  switch (param) {
    case "text/plain":
      return ".txt";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return ".docx";
    case "application/pdf":
      return ".pdf";
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return ".xlsx";
    case "video/mp4":
      return ".mp4";
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return ".pptx";
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    default:
      return "";
  }
}
export function renderRandomText() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*(){}:<>?~';,./[]";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
