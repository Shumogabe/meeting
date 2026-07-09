import React, { useEffect } from "react";

export default function APK() {
  useEffect(() => {
    const url = "/static/download/meeting_android.apk";
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "meeting_android.apk");
    document.body.appendChild(link);
    link.click();
    // Clean up: revoke the object URL and remove the link element
    document.body.removeChild(link); // Remove the link from the document
    window.URL.revokeObjectURL(url);
  }, []);

  return <></>;
}
