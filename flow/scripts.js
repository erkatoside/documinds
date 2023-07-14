import * as fcl from "@onflow/fcl";

const IS_INITIALIZED = `
import Documinds from 0xDocuminds

pub fun main(account: Address): Bool {
    let capability = getAccount(account).getCapability<&{Documinds.DocReceiver}>(Documinds.CollectionPublicPath)
    return capability.check()
}`;

export async function checkIsInitialized(addr) {
  return fcl.query({
    cadence: IS_INITIALIZED,
    args: (arg, t) => [arg(addr, t.Address)],
  });
}

const GET_OWNED_DOCS = `
import Documinds from 0xDocuminds

pub fun main(account: Address): [Documinds.DocumentInfo] {
    let owner = getAccount(account)
    let capability = owner.getCapability<&{Documinds.DocReceiver}>(Documinds.CollectionPublicPath)
    let receiverRef = capability.borrow() ?? panic("Could not borrow receiver reference")
    let docs: [Documinds.DocumentInfo] = []
    for id in receiverRef.ownedDocs.keys {
      let docInfo = receiverRef.ownedDocs[id]?.getDocInfo()!
      docs.append(docInfo)
    }
    return docs
}`;

export async function getOwnedDocs(addr) {
  return fcl.query({
    cadence: GET_OWNED_DOCS,
    args: (arg, t) => [arg(addr, t.Address)],
  });
}