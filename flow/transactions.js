import * as fcl from "@onflow/fcl";

const INIT_ACCOUNT = `
import Documinds from 0xDocuminds
transaction() {
    prepare(account: AuthAccount) {
        account.save(<-Documinds.createEmptyDocCollection(), to: Documinds.CollectionStoragePath)
        account.link<&{Documinds.DocReceiver}>(Documinds.CollectionPublicPath, target: Documinds.CollectionStoragePath)
    }
}`;

export async function initializeAccount() {
  return fcl.mutate({
    cadence: INIT_ACCOUNT,
    payer: fcl.authz,
    proposer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 1000,
  });
}

const CREATE_DOC = `
import Documinds from 0xDocuminds
transaction (name: String, ipfsHash: String) {
  let receiverRef: &{Documinds.DocReceiver}

  prepare(acct: AuthAccount) {
      self.receiverRef = acct.getCapability<&{Documinds.DocReceiver}>(Documinds.CollectionPublicPath).borrow() ?? panic("Could not borrow receiver reference")
  }

  execute {
      let newDoc <- Documinds.mintDocument(name: name, ipfsHash: ipfsHash)
      self.receiverRef.deposit(token: <-newDoc)
  }
}`;

export async function createDoc(name, ipfsHash) {
  return fcl.mutate({
    cadence: CREATE_DOC,
    payer: fcl.authz,
    proposer: fcl.authz,
    args: (arg, t) => [arg(name, t.String), arg(ipfsHash, t.String)],
    authorizations: [fcl.authz],
    limit: 1000,
  });
}