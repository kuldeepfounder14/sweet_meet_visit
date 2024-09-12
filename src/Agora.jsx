// import { useState } from 'react';
// import AgoraRTC from "agora-rtc-sdk-ng";

import { LocalUser, RemoteUser, useIsConnected, useJoin, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish, useRemoteUsers } from "agora-rtc-react";
import { useState } from "react";

// const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

// const Agora = () => {
//   const [localTracks, setLocalTracks] = useState([]);
//   const [remoteUsers, setRemoteUsers] = useState([]);

//   const startCall = async (channelName, token, uid) => {
//     try {
//       // Join the channel with the generated token
//       await client.join("YOUR_APP_ID", channelName, token, uid);

//       // Create local tracks (audio/video)
//       const localTrack = await AgoraRTC.createMicrophoneAndCameraTracks();
//       setLocalTracks(localTrack);

//       // Play local tracks (your own video)
//       localTrack[1].play("local-video");
// //
//       // Publish the local tracks
//       await client.publish(localTrack);

//       // Handle remote users
//       client.on("user-published", async (user, mediaType) => {
//         await client.subscribe(user, mediaType);
//         if (mediaType === 'video') {
//           const remoteVideoTrack = user.videoTrack;
//           remoteVideoTrack.play(`remote-video-${user.uid}`);
//         }
//         setRemoteUsers((prevUsers) => [...prevUsers, user]);
//       });
//     } catch (error) {
//       console.error("Failed to start the call", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Video Call App</h1>
//       <button onClick={() => startCall("kd", "00657a34fa6f38f45fb87e881bee656cba3IAB79ILWTdxO73hqua/P41uKRd2niE4yD+5wKEuZ0gA579IFD42j4OObEAD9/ccbjw/cZgEAAQAZvtpm", 1234)}>
//         Start Call
//       </button>
//       <div id="local-video" style={{ width: "300px", height: "300px" }}></div>
//       {remoteUsers.map((user) => (
//         <div key={user.uid} id={`remote-video-${user.uid}`} style={{ width: "300px", height: "300px" }}></div>
//       ))}
//     </div>
//   );
// };

// export default Agora;


export const Basics = () => {
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected(); // Store the user's connection status
  const [appId, setAppId] = useState("");
  const [channel, setChannel] = useState("");
  const [token, setToken] = useState("");

  useJoin({appid: appId, channel: channel, token: token ? token : null}, calling);

  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();

  return (
    <>
      <div className="p-10">
        {isConnected ? (
          <div className="user-list">
            <div className="user">
              <LocalUser
                audioTrack={localMicrophoneTrack}
                cameraOn={cameraOn}
                micOn={micOn}
                videoTrack={localCameraTrack}
                cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
              >
                <samp className="user-name">You</samp>
              </LocalUser>
            </div>
            {remoteUsers.map((user) => (
              <div className="user" key={user.uid}>
                <RemoteUser cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg" user={user}>
                  <samp className="user-name">{user.uid}</samp>
                </RemoteUser>
              </div>
            ))}
          </div>
        ) : (
          <div className="join-room">
            {/* <img alt="agora-logo" className="logo" src={agoraLogo} /> */}
            <input
              onChange={e => setAppId(e.target.value)}
              placeholder="<Your app ID>"
              value={appId}
            />
            <input
              onChange={e => setChannel(e.target.value)}
              placeholder="<Your channel Name>"
              value={channel}
            />
            <input
              onChange={e => setToken(e.target.value)}
              placeholder="<Your token>"
              value={token}
            />

            <button
              className={`join-channel ${!appId || !channel ? "disabled" : ""}`}
              disabled={!appId || !channel}
              onClick={() => setCalling(true)}
            >
              <span>Join Channel</span>
            </button>
          </div>
        )}
      </div>
      {isConnected && (
        <div className="control">
          <div className="left-control">
            <button className="btn" onClick={() => setMic(a => !a)}>
              <i className={`i-microphone ${!micOn ? "off" : ""}`} />
            </button>
            <button className="btn" onClick={() => setCamera(a => !a)}>
              <i className={`i-camera ${!cameraOn ? "off" : ""}`} />
            </button>
          </div>
          <button
            className={`btn btn-phone ${calling ? "btn-phone-active" : ""}`}
            onClick={() => setCalling(a => !a)}
          >
            {calling ? <i className="i-phone-hangup" /> : <i className="i-mdi-phone" />}
          </button>
        </div>
      )}
    </>
  );
};

export default Basics;

