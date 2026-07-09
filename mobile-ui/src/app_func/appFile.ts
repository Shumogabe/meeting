import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import download from 'downloadjs';
import { APP_File_CheckPermissions } from "./appDevicePermission";
import { APP_COMPONENT_IonToast } from "./appComponent";
import { ToastController } from "@ionic/angular";

export const APP_FILE_SelectFile = (options: { accept: string, multiple?: boolean }, callback: Function) => {
    var inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.accept = options.accept;
    inputFile.multiple = !!options.multiple;
    inputFile.style.display = 'none';
    inputFile.style.visibility = 'hidden';
    inputFile.addEventListener('change', (e: any) => {
        e.preventDefault();

        let files = (e.target?.files || []) as any;
        if (files.length > 0) {
            callback(files);
        }

        //xài xong thì ruồng bỏ
        document.body.removeChild(inputFile);
    });
    //trên safari(iPhone), phải đưa hàng lên thì mới xài được
    document.body.appendChild(inputFile);
    //tạo rồi thì xài luôn
    inputFile.click();
}

export const APP_FILE_Download = async (options: { blob?: Blob, fileName?: string, fileType?: string }, components?: { toastController: ToastController }) => {
    switch (Capacitor.getPlatform()) {
        case 'web':
            {
                if (options.blob) {
                    download(options.blob, options.fileName, options.fileType);
                }
                break;
            }
        case 'android':
        case 'ios':
            {
                let res = await APP_File_CheckPermissions();
                if (res.status) {
                    if (options.blob) {
                        Filesystem
                            .writeFile({
                                path: options.fileName ?? 'fileNoName',
                                data: await convertBlobToBase64(options.blob),
                                directory: Directory.Documents,
                                recursive: true
                            })
                            .then(resFS => {
                                if (resFS.uri) {
                                    Share.share({
                                        files: [resFS.uri]
                                    });
                                }
                            });
                    }
                }
                else {
                    if (components?.toastController)
                        APP_COMPONENT_IonToast(components.toastController, {}, res).then(toast => toast.present());
                }
            }
    }
}

// Utility function to convert Blob to Base64
function convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob); // Read the Blob as a Data URL
    });
}