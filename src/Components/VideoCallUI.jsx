// VideoCallUI.js
import { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const VideoCallUI = ({ isActive, onEndCall }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  const channelName = 'your_channel_name'; // Replace with your channel name
  const token = 'your_agora_token'; // Replace with your Agora token
  const uid = 'your_user_id'; // Replace with your user ID

  useEffect(() => {
    const initAgora = async () => {
      if (isActive) {
        try {
          await client.join(token, channelName, uid);
          const localTrack = await AgoraRTC.createMicrophoneAndCameraTracks();
          setLocalStream(localTrack[1]);
          localTrack[1].play('local-player');
          await client.publish(localTrack);

          client.on('user-published', async (user, mediaType) => {
            await client.subscribe(user, mediaType);
            if (mediaType === 'video') {
              const remoteStream = user.videoTrack;
              setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
              remoteStream.play('remote-player');
            }
          });

          client.on('user-unpublished', (user) => {
            setRemoteStreams((prevStreams) =>
              prevStreams.filter((stream) => stream !== user.videoTrack)
            );
          });
        } catch (error) {
          console.error('Error initializing Agora:', error);
        }
      }
    };

    initAgora();

    return () => {
      if (localStream) {
        localStream.stop();
        localStream.close();
      }
      client.leave();
      client.removeAllListeners();
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="flex flex-col items-center">
      <div id="local-player" className="w-72 h-40 bg-black text-white flex items-center justify-center mb-5 rounded-lg">
        Local Stream
      </div>
      <div id="remote-player" className="w-72 h-40 bg-black text-white flex items-center justify-center mb-5 rounded-lg">
        Remote Stream
      </div>
      <button
        className="px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 transition duration-300"
        onClick={onEndCall}
      >
        End Call
      </button>
    </div>
  );
};

export default VideoCallUI;
