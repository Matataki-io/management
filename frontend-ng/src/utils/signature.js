export const requestToSignTypedData = (signer, data) => new Promise((resolve, reject) => {
  window.ethereum.sendAsync(
    {
      method: 'eth_signTypedData_v3',
      params: [signer, data],
      from: signer
    },
    (err, result) => {
      if (err) {
        return reject(err)
      }
      const signature = result.result.substring(2)
      const r = '0x' + signature.substring(0, 64)
      const s = '0x' + signature.substring(64, 128)
      const v = parseInt(signature.substring(128, 130), 16)
      return resolve({ r, s, v, signature })
    }
  )
})

export async function signLoginRequest(who) {
  // timestamp is deadline
  const message = { timestamp: Math.floor(Date.now() / 1000) + 60 * 10, action: 'login' }
  const request = {
    types: {
      EIP712Domain: [{ name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
        { name: 'salt', type: 'bytes32' }],
      Login: [
        { name: 'timestamp', type: 'uint256' },
        { name: 'action', type: 'string' }
      ]
    },
    domain: {
      name: 'Matataki Public Management',
      version: '1',
      chainId: '56',
      verifyingContract: '0xec7580145Ff335Ab4b6724CE7131eB799F86B3aE',
      salt: '0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558'
    },
    primaryType: 'Login',
    message
  }
  const signature = await requestToSignTypedData(who, JSON.stringify(request))
  return { signature, message }
}
