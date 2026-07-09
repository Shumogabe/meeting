import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { Filesystem } from '@capacitor/filesystem';

//CAMERA
export const APP_Camera_CheckPermissions = async () => {

    if (!['ios', 'android'].includes(Capacitor.getPlatform())) {
        return { status: false, message: 'Không hỗ trợ' };
    }

    let res = await Camera.checkPermissions();
    switch (res?.camera) {
        case 'granted': {
            return { status: true, message: 'OK' };
        }
        case 'denied': {
            return { status: false, message: 'Bạn đã từ chối cho phép ứng dụng mở Camera' }
        }
        case 'prompt':
        case 'prompt-with-rationale': {
            return await APP_Camera_RequestPermissions();
        }
    }

    return { status: false, message: 'Something is wrong ?' };
}

export const APP_Camera_RequestPermissions = async () => {
    if (!['ios', 'android'].includes(Capacitor.getPlatform())) {
        return { status: false, message: 'Không hỗ trợ' };
    }

    let res = await Camera.requestPermissions();
    switch (res?.camera) {
        case 'granted': {
            return { status: true, message: 'OK' };
        }
        case 'denied': {
            return { status: false, message: 'Bạn đã từ chối cho phép ứng dụng mở Camera' }
        }
        case 'limited': {
            return { status: true, message: 'LIMIT' };
        }
    }

    return { status: false, message: 'Something is wrong ?' };
}

//MICROPHONE
export const APP_Microphone_Available = async () => {

    if (!['ios', 'android'].includes(Capacitor.getPlatform())) {
        return { status: false, message: 'Không hỗ trợ' };
    }

    let res = await SpeechRecognition.available();
    if (res?.available) {
        return await APP_Microphone_CheckPermissions();
    }
    else {
        return { status: false, message: 'Thiết bị không hỗ trợ' };
    }

}

export const APP_Microphone_CheckPermissions = async () => {

    if (!['ios', 'android'].includes(Capacitor.getPlatform())) {
        return { status: false, message: 'Không hỗ trợ' };
    }

    let res = await SpeechRecognition.checkPermissions();
    switch (res?.speechRecognition) {
        case 'granted': {
            return { status: true, message: 'OK' };
        }
        case 'denied': {
            return { status: false, message: 'Bạn đã từ chối cho phép ứng dụng mở Microphone' }
        }
        case 'prompt':
        case 'prompt-with-rationale': {
            return await APP_Microphone_RequestPermissions();
        }
    }

    return { status: false, message: 'Something is wrong ?' };
}

export const APP_Microphone_RequestPermissions = async () => {
    if (!['ios', 'android'].includes(Capacitor.getPlatform())) {
        return { status: false, message: 'Không hỗ trợ' };
    }

    let res = await SpeechRecognition.requestPermissions();
    switch (res?.speechRecognition) {
        case 'granted': {
            return { status: true, message: 'OK' };
        }
        case 'denied': {
            return { status: false, message: 'Bạn đã từ chối cho phép ứng dụng mở Camera' }
        }
    }

    return { status: false, message: 'Something is wrong ?' };
}

//FILE
export const APP_File_CheckPermissions = async () => {

    if (!['ios', 'android'].includes(Capacitor.getPlatform())) {
        return { status: false, message: 'Không hỗ trợ' };
    }

    let res = await Filesystem.checkPermissions();
    switch (res?.publicStorage) {
        case 'granted': {
            return { status: true, message: 'OK' };
        }
        case 'denied': {
            return { status: false, message: 'Bạn đã từ chối cho phép ứng dụng sử dụng kho lưu trữ' }
        }
        case 'prompt':
        case 'prompt-with-rationale': {
            return await APP_File_RequestPermissions();
        }
    }

    return { status: false, message: 'Something is wrong ?' };
}

export const APP_File_RequestPermissions = async () => {
    if (!['ios', 'android'].includes(Capacitor.getPlatform())) {
        return { status: false, message: 'Không hỗ trợ' };
    }

    let res = await Filesystem.requestPermissions();
    switch (res?.publicStorage) {
        case 'granted': {
            return { status: true, message: 'OK' };
        }
        case 'denied': {
            return { status: false, message: 'Bạn đã từ chối cho phép ứng dụng sử dụng kho lưu trữ' }
        }
    }

    return { status: false, message: 'Something is wrong ?' };
}