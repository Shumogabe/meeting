import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { APP_ROUTE } from 'src/app_func/appRoute';

@Component({
  selector: 'app-jitsi-meet',
  templateUrl: './jitsi-meet.component.html',
  styleUrls: ['./jitsi-meet.component.scss']
})
export class JitsiMeetComponent implements OnInit, OnDestroy {
  @ViewChild('jitsiContainer', { static: true }) jitsiContainer!: ElementRef;

  @Input({ required: true }) roomData: any;
  @Input({ required: true }) userData: any;

  private api: any;

  ngOnInit(): void {
    console.log(this.roomData);
    const options = {
      roomName: this.roomData.roomName,
      width: '100%',
      height: '100%',
      parentNode: this.jitsiContainer.nativeElement,
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_BACKGROUND: '#ffffff',
        // TOOLBAR_BUTTONS: [
        //   'microphone', 'camera', 'desktop', 'fullscreen',
        //   'fodeviceselection', 'hangup', 'profile', 'chat',
        //   'recording', 'livestreaming', 'etherpad', 'sharedvideo',
        //   'settings', 'raisehand', 'videoquality', 'filmstrip',
        //   'invite', 'feedback', 'stats', 'shortcuts'
        // ],
      },
      configOverwrite: {
        disableDeepLinking: true, // Vô hiệu hóa liên kết đến ứng dụng
        disableWakeLock: true, // Vô hiệu hóa yêu cầu wake lock
        startWithAudioMuted: false,  // Bắt đầu với âm thanh
        startWithVideoMuted: false,  // Bắt đầu với video
        disableAudioLevels: false,   // Kích hoạt audio levels
        enableWelcomePage: false,
        disableSimulcast: true,
      },
      prejoinPageEnabled: false,
      userInfo: {
        displayName: this.userData.name,
        email: this.userData.email,
      },
      jwt: this.roomData.token,
      onload: () => {
        console.log('Jitsi Meet iframe loaded');
      }
    };

    this.api = new (window as any).JitsiMeetExternalAPI(this.roomData.server.ip, options);

    // Listen for when the local user joins the conference
    this.api.addEventListener('videoConferenceJoined', (ev: any) => {
      console.log('Local user joined the conference:', ev);
    });

    // Listen for when a remote participant joins
    this.api.addEventListener('participantJoined', (ev: any) => {
      console.log('Participant joined:', ev);
    });

    // Listen for when a remote participant leaves
    this.api.addEventListener('participantLeft', (ev: any) => {
      console.log('Participant left:', ev);
    });

    // Listen for audio mute status changes
    this.api.addEventListener('audioMuteStatusChanged', (ev: any) => {
      console.log('Audio mute status changed:', ev.muted);
    });

    // Listen for video mute status changes
    this.api.addEventListener('videoMuteStatusChanged', (ev: any) => {
      console.log('Video mute status changed:', ev.muted);
    });

    // Listen for when the conference is ready to be closed
    this.api.addEventListener('readyToClose', () => {
      console.log('Conference is ready to be closed');
      //
      window.location.replace(APP_ROUTE.HOME);
    });

    this.api.on('errorOccurred', (error: any) => {
      console.error("Lỗi khi truy cập camera hoặc microphone: ", error);
    });

    // Dispose the API when the window is closed
    window.addEventListener('beforeunload', () => {
      this.api.dispose();
    });
  }

  ngOnDestroy(): void {
    if (this.api) {
      this.api.dispose();
    }
  }
}
