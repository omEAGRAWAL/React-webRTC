// // import React, { useEffect, useCallback, useState, useRef } from "react";
// // import peer from "../service/peer";
// // import { useSocket } from "../context/SocketProvider";

// // const RoomPage = () => {
// //   const socket = useSocket();
// //   const [remoteSocketId, setRemoteSocketId] = useState(null);
// //   const [myStream, setMyStream] = useState();
// //   const [remoteStream, setRemoteStream] = useState();

// //   const myVideoRef = useRef(null);
// //   const remoteVideoRef = useRef(null);

// //   // ✅ Attach streams to video elements when they change
// //   useEffect(() => {
// //     if (myVideoRef.current && myStream) {
// //       myVideoRef.current.srcObject = myStream;
// //     }
// //   }, [myStream]);

// //   useEffect(() => {
// //     if (remoteVideoRef.current && remoteStream) {
// //       remoteVideoRef.current.srcObject = remoteStream;
// //     }
// //   }, [remoteStream]);

// //   const handleUserJoined = useCallback(({ email, id }) => {
// //     console.log(`✅ ${email} joined room`);
// //     setRemoteSocketId(id);
// //   }, []);

// //   const handleCallUser = useCallback(async () => {
// //     const stream = await navigator.mediaDevices.getUserMedia({
// //       audio: true,
// //       video: true,
// //     });
// //     setMyStream(stream);

// //     const offer = await peer.getOffer();
// //     socket.emit("user:call", { to: remoteSocketId, offer });
// //   }, [remoteSocketId, socket]);

// //   const handleIncomingCall = useCallback(
// //     async ({ from, offer }) => {
// //       console.log("📞 Incoming call from:", from);
// //       setRemoteSocketId(from);

// //       const stream = await navigator.mediaDevices.getUserMedia({
// //         audio: true,
// //         video: true,
// //       });
// //       setMyStream(stream);

// //       const ans = await peer.getAnswer(offer);
// //       socket.emit("call:accepted", { to: from, ans });
// //     },
// //     [socket]
// //   );

// //   const sendStreams = useCallback(() => {
// //     if (!myStream) return;
// //     myStream.getTracks().forEach((track) => {
// //       peer.peer.addTrack(track, myStream);
// //     });
// //   }, [myStream]);

// //   const handleCallAccepted = useCallback(
// //     ({ from, ans }) => {
// //       console.log("✅ Call accepted by:", from);
// //       peer.setLocalDescription(ans);
// //       sendStreams();
// //     },
// //     [sendStreams]
// //   );

// //   const handleNegoNeeded = useCallback(async () => {
// //     const offer = await peer.getOffer();
// //     socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
// //   }, [remoteSocketId, socket]);

// //   useEffect(() => {
// //     peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
// //     return () => {
// //       peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
// //     };
// //   }, [handleNegoNeeded]);

// //   const handleNegoNeedIncoming = useCallback(
// //     async ({ from, offer }) => {
// //       const ans = await peer.getAnswer(offer);
// //       socket.emit("peer:nego:done", { to: from, ans });
// //     },
// //     [socket]
// //   );

// //   const handleNegoNeedFinal = useCallback(async ({ ans }) => {
// //     await peer.setLocalDescription(ans);
// //   }, []);

// //   // ✅ Handle remote track events
// //   useEffect(() => {
// //     peer.peer.addEventListener("track", (ev) => {
// //       const [stream] = ev.streams;
// //       console.log("🎥 Got remote track!");
// //       setRemoteStream(stream);
// //     });
// //   }, []);

// //   // ✅ Register Socket event listeners
// //   useEffect(() => {
// //     socket.on("user:joined", handleUserJoined);
// //     socket.on("incomming:call", handleIncomingCall);
// //     socket.on("call:accepted", handleCallAccepted);
// //     socket.on("peer:nego:needed", handleNegoNeedIncoming);
// //     socket.on("peer:nego:final", handleNegoNeedFinal);

// //     return () => {
// //       socket.off("user:joined", handleUserJoined);
// //       socket.off("incomming:call", handleIncomingCall);
// //       socket.off("call:accepted", handleCallAccepted);
// //       socket.off("peer:nego:needed", handleNegoNeedIncoming);
// //       socket.off("peer:nego:final", handleNegoNeedFinal);
// //     };
// //   }, [
// //     socket,
// //     handleUserJoined,
// //     handleIncomingCall,
// //     handleCallAccepted,
// //     handleNegoNeedIncoming,
// //     handleNegoNeedFinal,
// //   ]);

// //   return (
// //     <div>
// //       <h1>Room Page</h1>
// //       <h4>{remoteSocketId ? "🟢 Connected" : "🔴 Waiting for someone..."}</h4>

// //       {remoteSocketId && (
// //         <button onClick={handleCallUser} style={{ marginRight: 8 }}>
// //           📞 Call User
// //         </button>
// //       )}
// //       {myStream && (
// //         <button onClick={sendStreams} style={{ marginLeft: 8 }}>
// //           📤 Send Stream
// //         </button>
// //       )}

// //       <div style={{ marginTop: 20 }}>
// //         {myStream && (
// //           <>
// //             <h3>My Stream</h3>
// //             <video
// //               ref={myVideoRef}
// //               autoPlay
// //               muted
// //               playsInline
// //               height="150"
// //               width="250"
// //             />
// //           </>
// //         )}

// //         {remoteStream && (
// //           <>
// //             <h3>Remote Stream</h3>
// //             <video
// //               ref={remoteVideoRef}
// //               autoPlay
// //               playsInline
// //               height="150"
// //               width="250"
// //             />
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default RoomPage;
// import React, { useEffect, useCallback, useState, useRef } from "react";
// import peer from "../service/peer";
// import { useSocket } from "../context/SocketProvider";

// const RoomPage = () => {
//   const socket = useSocket();
//   const [remoteSocketId, setRemoteSocketId] = useState(null);
//   const [myStream, setMyStream] = useState();
//   const [remoteStream, setRemoteStream] = useState();
//   const [recording, setRecording] = useState(false);
//   const [recordedUrl, setRecordedUrl] = useState(null);

//   const myVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const recorderRef = useRef(null);
//   const recordedChunksRef = useRef([]);

//   // ✅ Attach streams to <video>
//   useEffect(() => {
//     if (myVideoRef.current && myStream) {
//       myVideoRef.current.srcObject = myStream;
//     }
//   }, [myStream]);

//   useEffect(() => {
//     if (remoteVideoRef.current && remoteStream) {
//       remoteVideoRef.current.srcObject = remoteStream;
//     }
//   }, [remoteStream]);

//   const handleUserJoined = useCallback(({ email, id }) => {
//     console.log(`✅ ${email} joined room`);
//     setRemoteSocketId(id);
//   }, []);

//   const handleCallUser = useCallback(async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: true,
//     });
//     setMyStream(stream);

//     const offer = await peer.getOffer();
//     socket.emit("user:call", { to: remoteSocketId, offer });
//   }, [remoteSocketId, socket]);

//   const handleIncomingCall = useCallback(
//     async ({ from, offer }) => {
//       console.log("📞 Incoming call from:", from);
//       setRemoteSocketId(from);

//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });
//       setMyStream(stream);

//       const ans = await peer.getAnswer(offer);
//       socket.emit("call:accepted", { to: from, ans });
//     },
//     [socket]
//   );

//   const sendStreams = useCallback(() => {
//     if (!myStream) return;
//     myStream.getTracks().forEach((track) => {
//       peer.peer.addTrack(track, myStream);
//     });
//   }, [myStream]);

//   const handleCallAccepted = useCallback(
//     ({ from, ans }) => {
//       console.log("✅ Call accepted by:", from);
//       peer.setLocalDescription(ans);
//       sendStreams();
//     },
//     [sendStreams]
//   );

//   const handleNegoNeeded = useCallback(async () => {
//     const offer = await peer.getOffer();
//     socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
//   }, [remoteSocketId, socket]);

//   useEffect(() => {
//     peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
//     return () => {
//       peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
//     };
//   }, [handleNegoNeeded]);

//   const handleNegoNeedIncoming = useCallback(
//     async ({ from, offer }) => {
//       const ans = await peer.getAnswer(offer);
//       socket.emit("peer:nego:done", { to: from, ans });
//     },
//     [socket]
//   );

//   const handleNegoNeedFinal = useCallback(async ({ ans }) => {
//     await peer.setLocalDescription(ans);
//   }, []);

//   // ✅ Handle remote track events
//   useEffect(() => {
//     peer.peer.addEventListener("track", (ev) => {
//       const [stream] = ev.streams;
//       console.log("🎥 Got remote track!");
//       setRemoteStream(stream);
//     });
//   }, []);

//   // ✅ Socket event listeners
//   useEffect(() => {
//     socket.on("user:joined", handleUserJoined);
//     socket.on("incomming:call", handleIncomingCall);
//     socket.on("call:accepted", handleCallAccepted);
//     socket.on("peer:nego:needed", handleNegoNeedIncoming);
//     socket.on("peer:nego:final", handleNegoNeedFinal);

//     return () => {
//       socket.off("user:joined", handleUserJoined);
//       socket.off("incomming:call", handleIncomingCall);
//       socket.off("call:accepted", handleCallAccepted);
//       socket.off("peer:nego:needed", handleNegoNeedIncoming);
//       socket.off("peer:nego:final", handleNegoNeedFinal);
//     };
//   }, [
//     socket,
//     handleUserJoined,
//     handleIncomingCall,
//     handleCallAccepted,
//     handleNegoNeedIncoming,
//     handleNegoNeedFinal,
//   ]);

//   // ✅ Recording logic
//   const startRecording = () => {
//     if (!myStream && !remoteStream) {
//       alert("Start a call first!");
//       return;
//     }

//     // Combine both local and remote streams
//     const combinedStream = new MediaStream([
//       ...(myStream?.getTracks() || []),
//       ...(remoteStream?.getTracks() || []),
//     ]);

//     const recorder = new MediaRecorder(combinedStream);
//     recorderRef.current = recorder;
//     recordedChunksRef.current = [];

//     recorder.ondataavailable = (e) => {
//       if (e.data.size > 0) recordedChunksRef.current.push(e.data);
//     };

//     recorder.onstop = () => {
//       const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
//       const url = URL.createObjectURL(blob);
//       setRecordedUrl(url);
//     };

//     recorder.start();
//     setRecording(true);
//     console.log("🎬 Recording started");
//   };

//   const stopRecording = () => {
//     if (recorderRef.current) {
//       recorderRef.current.stop();
//       setRecording(false);
//       console.log("🛑 Recording stopped");
//     }
//   };

//   return (
//     <div>
//       <h1>Room Page</h1>
//       <h4>{remoteSocketId ? "🟢 Connected" : "🔴 Waiting for someone..."}</h4>

//       {remoteSocketId && (
//         <button onClick={handleCallUser} style={{ marginRight: 8 }}>
//           📞 Call User
//         </button>
//       )}
//       {myStream && (
//         <button onClick={sendStreams} style={{ marginLeft: 8 }}>
//           📤 Send Stream
//         </button>
//       )}

//       <div style={{ marginTop: 20 }}>
//         {myStream && (
//           <>
//             <h3>My Stream</h3>
//             <video
//               ref={myVideoRef}
//               autoPlay
//               muted
//               playsInline
//               height="150"
//               width="250"
//             />
//           </>
//         )}

//         {remoteStream && (
//           <>
//             <h3>Remote Stream</h3>
//             <video
//               ref={remoteVideoRef}
//               autoPlay
//               playsInline
//               height="150"
//               width="250"
//             />
//           </>
//         )}
//       </div>

//       <div style={{ marginTop: 20 }}>
//         {!recording ? (
//           <button onClick={startRecording} disabled={!remoteStream}>
//             🎥 Start Recording
//           </button>
//         ) : (
//           <button onClick={stopRecording}>🛑 Stop Recording</button>
//         )}
//       </div>

//       {recordedUrl && (
//         <div style={{ marginTop: 20 }}>
//           <h3>Recorded Call</h3>
//           <video src={recordedUrl} controls width="300" />
//           <a href={recordedUrl} download="call_recording.webm">
//             ⬇️ Download
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RoomPage;
