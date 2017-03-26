export const sessionDescriptionProtocolConstraints = {
  mandatory: {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false,
  },
}

export const peerConnectionConfig = {
  iceServers: [
    { url: 'stun:stun.services.mozilla.com' },
    { url: 'stun:stun.l.google.com:19302' },
  ],
}
