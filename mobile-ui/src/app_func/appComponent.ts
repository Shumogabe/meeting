import { ToastController, ToastOptions } from "@ionic/angular";
import { IOptionResponse } from "src/app_models/Repository";

export const APP_COMPONENT_IonToast = async (
    toastController: ToastController,
    options: ToastOptions,
    response?: IOptionResponse
) => {

    if (!options.message) {
        if (response) {
            options.message = response?.message ?? "Hệ thống không có phản hồi!"

            if (!options.icon) {
                if (response?.message) {
                    options.icon = "checkmark-circle-sharp";
                }
                else {
                    options.icon = "alert-circle-outline";
                }
            }

            if (!options.color) {
                if (response?.status) {
                    options.color = "success";
                }
                else if (response?.data == -1) {
                    options.color = "danger";
                }
                else {
                    options.color = "warning";
                }
            }
        }
    }

    if (!options.position) {
        options.position = 'middle';
    }
    if (!options.icon) {
        options.icon = "bulb-outline";
    }
    if (!options.color) {
        options.color = 'secondary';
    }

    options.duration = options.duration ?? 3000;
    options.animated = options.animated ?? true;
    options.buttons = options.buttons ?? [
        { icon: "close-outline", side: "end", role: "cancel" }
    ];

    return await toastController.create(options);
}