import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Contract } from "../target/types/contract";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getAccount
} from "@solana/spl-token";
import { expect } from "chai";

describe("contract", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.Contract as Program<Contract>;
  const provider = anchor.AnchorProvider.env();

  let donor: anchor.web3.Keypair;
  let receiver: anchor.web3.Keypair;
  let mint: anchor.web3.PublicKey;
  let donorTokenAccount: any;
  let userProfilePda: anchor.web3.PublicKey;
  let solVaultPda: anchor.web3.PublicKey;
  let solVaultDataPda: anchor.web3.PublicKey;
  let vaultTokenAccountPda: anchor.web3.PublicKey;
  let userVaultPda: anchor.web3.PublicKey;
  let vaultPda: anchor.web3.PublicKey;

  before(async () => {
    donor = anchor.web3.Keypair.generate();
    receiver = anchor.web3.Keypair.generate();

    const airdropDonor = await provider.connection.requestAirdrop(
      donor.publicKey,
      10 * anchor.web3.LAMPORTS_PER_SOL
    );
    const airdropReceiver = await provider.connection.requestAirdrop(
      receiver.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );

    await provider.connection.confirmTransaction(airdropDonor);
    await provider.connection.confirmTransaction(airdropReceiver);

    mint = await createMint(
      provider.connection,
      donor,
      donor.publicKey,
      null,
      9
    );

    donorTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      donor,
      mint,
      donor.publicKey
    );

    await mintTo(
      provider.connection,
      donor,
      mint,
      donorTokenAccount.address,
      donor,
      1000000000000
    );

    [userProfilePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user-profile"), receiver.publicKey.toBuffer()],
      program.programId
    );

    [solVaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("sol-vault"), receiver.publicKey.toBuffer()],
      program.programId
    );

    [solVaultDataPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("sol-vault-data"), receiver.publicKey.toBuffer()],
      program.programId
    );

    [vaultTokenAccountPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("spl-vault"), receiver.publicKey.toBuffer(), mint.toBuffer()],
      program.programId
    );

    [userVaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user-vault"), receiver.publicKey.toBuffer(), mint.toBuffer()],
      program.programId
    );

    [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), receiver.publicKey.toBuffer(), mint.toBuffer()],
      program.programId
    );
  });

  describe("Initialize Profile", () => {
    it("Should initialize user profile successfully", async () => {
      const name = "Test User";
      const about = "This is a test profile";

      const tx = await program.methods
        .initialize(name, about)
        .accounts({
          userProfile: userProfilePda,
          signer: receiver.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([receiver])
        .rpc();

      console.log("Initialize transaction signature:", tx);

      const profile = await program.account.userProfile.fetch(userProfilePda);
      expect(profile.name).to.equal(name);
      expect(profile.about).to.equal(about);
    });

    it("Should fail to initialize profile twice", async () => {
      try {
        await program.methods
          .initialize("Another Name", "Another About")
          .accounts({
            userProfile: userProfilePda,
            signer: receiver.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([receiver])
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe("Donate SOL", () => {
    it("Should donate SOL successfully", async () => {
      const donationAmount = 1 * anchor.web3.LAMPORTS_PER_SOL;

      const donorBalanceBefore = await provider.connection.getBalance(donor.publicKey);

      try {

        const tx = await program.methods
          .donateSol(new anchor.BN(donationAmount))
          .accounts({
            donor: donor.publicKey,
            receiver: receiver.publicKey,
            solVault: solVaultPda,
            solVaultData: solVaultDataPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([donor])
          .rpc();
        console.log("Donate SOL transaction signature:", tx);
      } catch (e) {
        console.log(JSON.stringify(e));
      }


      const donorBalanceAfter = await provider.connection.getBalance(donor.publicKey);
      const vaultBalance = await provider.connection.getBalance(solVaultPda);

      console.log("Donor before:", donorBalanceBefore / anchor.web3.LAMPORTS_PER_SOL);
      console.log("Donor after:", donorBalanceAfter / anchor.web3.LAMPORTS_PER_SOL);
      console.log("Vault balance:", vaultBalance / anchor.web3.LAMPORTS_PER_SOL);

      expect(donorBalanceBefore - donorBalanceAfter).to.be.greaterThan(donationAmount);
      expect(vaultBalance).to.be.greaterThan(0);

      const solVaultData = await program.account.solVaultData.fetch(solVaultDataPda);
      console.log("Vault data amount:", solVaultData.amount.toNumber() / anchor.web3.LAMPORTS_PER_SOL);
      expect(solVaultData.owner.toString()).to.equal(receiver.publicKey.toString());
      expect(solVaultData.bump).to.be.greaterThan(0);
      expect(solVaultData.amount.toNumber()).to.equal(donationAmount);
    });

    it("Should fail to donate 0 SOL", async () => {
      try {
        await program.methods
          .donateSol(new anchor.BN(0))
          .accounts({
            donor: donor.publicKey,
            receiver: receiver.publicKey,
            solVault: solVaultPda,
            solVaultData: solVaultDataPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([donor])
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.toString()).to.include("InvalidAmount");
      }
    });
  });

  describe("Claim SOL", () => {
    it("Should claim SOL successfully", async () => {
      const solVaultData = await program.account.solVaultData.fetch(solVaultDataPda);
      const vaultBalanceBefore = await provider.connection.getBalance(solVaultDataPda);
      const receiverBalanceBefore = await provider.connection.getBalance(receiver.publicKey);

      const rentExemption = await provider.connection.getMinimumBalanceForRentExemption(
        8 + 1 + 32 + 8
      );

      const claimAmount = solVaultData.amount.toNumber();

      try {
        const tx = await program.methods
          .claimSol(new anchor.BN(claimAmount))
          .accounts({
            signer: receiver.publicKey,
            solVault: solVaultPda,
            solVaultData: solVaultDataPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([receiver])
          .rpc();
        console.log("Claim SOL transaction signature:", tx);
      } catch (e) {
        console.log("Error:", e);
      }

      const vaultBalanceAfter = await provider.connection.getBalance(solVaultDataPda);
      const receiverBalanceAfter = await provider.connection.getBalance(receiver.publicKey);
      expect(vaultBalanceAfter).to.equal(rentExemption);

      expect(receiverBalanceAfter).to.be.greaterThan(receiverBalanceBefore);


      const solVaultDataAfter = await program.account.solVaultData.fetch(solVaultDataPda);


      console.log("Vault data amount after claim:", solVaultDataAfter.amount.toNumber());

      expect(solVaultDataAfter.amount.toNumber()).to.equal(0);
    });
  });

  // SPL token donation and claim tests remain unchanged
  describe("Donate SPL", () => {
    it("Should donate SPL tokens successfully", async () => {
      const donationAmount = 100000000;

      const donorTokenAccountBefore = await getAccount(
        provider.connection,
        donorTokenAccount.address
      );

      const tx = await program.methods
        .donateSpl(new anchor.BN(donationAmount))
        .accounts({
          donor: donor.publicKey,
          receiver: receiver.publicKey,
          donorTokenAccount: donorTokenAccount.address,
          vaultTokenAccount: vaultTokenAccountPda,
          userVault: userVaultPda,
          vault: vaultPda,
          mint: mint,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        })
        .signers([donor])
        .rpc();

      console.log("Donate SPL transaction signature:", tx);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const donorTokenAccountAfter = await getAccount(
        provider.connection,
        donorTokenAccount.address
      );
      const vaultTokenAccount = await getAccount(
        provider.connection,
        vaultTokenAccountPda
      );

      expect(Number(donorTokenAccountBefore.amount) - Number(donorTokenAccountAfter.amount))
        .to.equal(donationAmount);
      expect(Number(vaultTokenAccount.amount)).to.equal(donationAmount);

      const userVault = await program.account.userVault.fetch(userVaultPda);
      expect(userVault.owner.toString()).to.equal(receiver.publicKey.toString());
      expect(userVault.mint.toString()).to.equal(mint.toString());
      expect(userVault.amount.toNumber()).to.equal(donationAmount);
    });

    it("Should fail to donate 0 SPL tokens", async () => {
      try {
        await program.methods
          .donateSpl(new anchor.BN(0))
          .accounts({
            donor: donor.publicKey,
            receiver: receiver.publicKey,
            donorTokenAccount: donorTokenAccount.address,
            vaultTokenAccount: vaultTokenAccountPda,
            userVault: userVaultPda,
            vault: vaultPda,
            mint: mint,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          })
          .signers([donor])
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.toString()).to.include("InvalidAmount");
      }
    });
  });

  describe("Claim SPL", () => {
    let receiverTokenAccount: any;

    before(async () => {
      [receiverTokenAccount] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          receiver.publicKey.toBuffer(),
          anchor.utils.token.TOKEN_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
        ],
        anchor.utils.token.ASSOCIATED_PROGRAM_ID
      );
    });

    it("Should claim SPL tokens successfully", async () => {
      const vaultTokenAccountBefore = await getAccount(
        provider.connection,
        vaultTokenAccountPda
      );

      const claimAmount = Number(vaultTokenAccountBefore.amount);

      const tx = await program.methods
        .clainSpl(new anchor.BN(claimAmount))
        .accounts({
          signer: receiver.publicKey,
          vaultTokenAccount: vaultTokenAccountPda,
          signerTokenAccount: receiverTokenAccount,
          userVault: userVaultPda,
          vault: vaultPda,
          mint: mint,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        })
        .signers([receiver])
        .rpc();

      console.log("Claim SPL transaction signature:", tx);

      const vaultTokenAccountAfter = await getAccount(
        provider.connection,
        vaultTokenAccountPda
      );
      const receiverTokenAccountData = await getAccount(
        provider.connection,
        receiverTokenAccount
      );

      expect(Number(vaultTokenAccountAfter.amount)).to.equal(0);
      expect(Number(receiverTokenAccountData.amount)).to.equal(claimAmount);

      const userVault = await program.account.userVault.fetch(userVaultPda);
      expect(userVault.amount.toNumber()).to.equal(0);
    });

    it("Should fail to claim more than vault balance", async () => {
      const excessiveAmount = 1000000000;

      try {
        await program.methods
          .clainSpl(new anchor.BN(excessiveAmount))
          .accounts({
            signer: receiver.publicKey,
            vaultTokenAccount: vaultTokenAccountPda,
            signerTokenAccount: receiverTokenAccount,
            userVault: userVaultPda,
            vault: vaultPda,
            mint: mint,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
          })
          .signers([receiver])
          .rpc();

        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.toString()).to.include("InsufficientBalance");
      }
    });
  });
});
