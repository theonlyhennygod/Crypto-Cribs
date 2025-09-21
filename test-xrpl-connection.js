#!/usr/bin/env node

/**
 * XRPL Testnet Connection Test
 * This script verifies XRPL ledger connectivity and basic functionality
 */

const xrpl = require('xrpl');

const XRPL_TESTNET_SERVER = "wss://s.altnet.rippletest.net:51233";

async function testXRPLConnection() {
  console.log('🔗 Testing XRPL Testnet Connection...\n');
  
  const client = new xrpl.Client(XRPL_TESTNET_SERVER);
  
  try {
    // Test 1: Basic Connection
    console.log('📡 Connecting to XRPL testnet...');
    await client.connect();
    console.log('✅ Successfully connected to XRPL testnet!\n');
    
    // Test 2: Get Server Info
    console.log('🔍 Getting server information...');
    const serverInfo = await client.request({
      command: 'server_info'
    });
    console.log('✅ Server Info Retrieved:');
    console.log(`   Network ID: ${serverInfo.result.info.network_id}`);
    console.log(`   Ledger Index: ${serverInfo.result.info.validated_ledger.seq}`);
    console.log(`   Server Version: ${serverInfo.result.info.build_version}\n`);
    
    // Test 3: Get Latest Ledger
    console.log('📚 Getting latest ledger...');
    const ledger = await client.request({
      command: 'ledger',
      ledger_index: 'validated'
    });
    console.log('✅ Latest Ledger Retrieved:');
    console.log(`   Ledger Hash: ${ledger.result.ledger.ledger_hash}`);
    console.log(`   Close Time: ${new Date(ledger.result.ledger.close_time_human)}`);
    console.log(`   Transaction Count: ${ledger.result.ledger.transactions?.length || 0}\n`);
    
    // Test 4: Create and Fund Test Wallet
    console.log('💰 Creating and funding test wallet...');
    const wallet = xrpl.Wallet.generate();
    console.log('✅ Test wallet generated:');
    console.log(`   Address: ${wallet.address}`);
    console.log(`   Seed: ${wallet.seed} (TESTNET ONLY - DO NOT USE ON MAINNET)\n`);
    
    // Fund the wallet
    console.log('🚰 Funding wallet from testnet faucet...');
    const fundResult = await client.fundWallet(wallet);
    console.log('✅ Wallet funded successfully!');
    
    // Get the balance properly
    const walletBalance = fundResult.wallet.balance || fundResult.balance;
    if (walletBalance && !isNaN(walletBalance)) {
      console.log(`   Balance: ${xrpl.dropsToXrp(walletBalance)} XRP\n`);
    } else {
      console.log('   Balance: Checking account info for balance...\n');
    }
    
    // Test 5: Get Account Info
    console.log('👤 Getting account information...');
    const accountInfo = await client.request({
      command: 'account_info',
      account: wallet.address,
      ledger_index: 'validated'
    });
    console.log('✅ Account Info Retrieved:');
    console.log(`   Account: ${accountInfo.result.account_data.Account}`);
    console.log(`   Balance: ${xrpl.dropsToXrp(accountInfo.result.account_data.Balance)} XRP`);
    console.log(`   Sequence: ${accountInfo.result.account_data.Sequence}\n`);
    
    // Test 6: Prepare Test Payment
    console.log('💸 Preparing test payment...');
    const payment = {
      TransactionType: 'Payment',
      Account: wallet.address,
      Destination: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH', // Test destination
      Amount: xrpl.xrpToDrops('1'), // 1 XRP
      Memos: [{
        Memo: {
          MemoData: Buffer.from('XRPL Test Payment from Crypto Cribs', 'utf8').toString('hex').toUpperCase()
        }
      }]
    };
    
    // Submit payment
    const paymentResult = await client.submitAndWait(payment, { wallet });
    console.log('✅ Test payment successful!');
    console.log(`   Transaction Hash: ${paymentResult.result.hash}`);
    console.log(`   Result: ${paymentResult.result.meta?.TransactionResult}`);
    console.log(`   Explorer: https://testnet.xrpl.org/transactions/${paymentResult.result.hash}\n`);
    
    // Test 7: Verify Transaction
    console.log('🔍 Verifying transaction...');
    const tx = await client.request({
      command: 'tx',
      transaction: paymentResult.result.hash
    });
    console.log('✅ Transaction verified:');
    console.log(`   Validated: ${tx.result.validated}`);
    console.log(`   Ledger Index: ${tx.result.ledger_index}`);
    console.log(`   Fee: ${xrpl.dropsToXrp(tx.result.Fee)} XRP\n`);
    
    // Test 8: Get Updated Balance
    console.log('💰 Getting updated account balance...');
    const updatedAccount = await client.request({
      command: 'account_info',
      account: wallet.address,
      ledger_index: 'validated'
    });
    console.log('✅ Updated balance:');
    console.log(`   New Balance: ${xrpl.dropsToXrp(updatedAccount.result.account_data.Balance)} XRP\n`);
    
    console.log('🎉 All XRPL tests passed successfully!');
    console.log('📋 Test Summary:');
    console.log('   ✅ Network connection');
    console.log('   ✅ Server communication');
    console.log('   ✅ Ledger data retrieval');
    console.log('   ✅ Wallet creation');
    console.log('   ✅ Testnet funding');
    console.log('   ✅ Payment submission');
    console.log('   ✅ Transaction verification');
    console.log('   ✅ Balance updates\n');
    
    console.log('🚀 Your XRPL integration is ready for the dapp!');
    
  } catch (error) {
    console.error('❌ XRPL Test Failed:', error.message);
    
    if (error.message.includes('WebSocket')) {
      console.log('\n🔧 Troubleshooting WebSocket Connection:');
      console.log('   - Check internet connection');
      console.log('   - Verify testnet server is accessible');
      console.log('   - Try alternative server: wss://s.devnet.rippletest.net:51233');
    } else if (error.message.includes('fundWallet')) {
      console.log('\n🔧 Troubleshooting Faucet:');
      console.log('   - Testnet faucet may be temporarily unavailable');
      console.log('   - Try manual funding: https://xrpl.org/xrp-testnet-faucet.html');
    }
  } finally {
    if (client.isConnected()) {
      await client.disconnect();
      console.log('\n🔌 Disconnected from XRPL testnet');
    }
  }
}

// Run the test
testXRPLConnection().catch(console.error);
