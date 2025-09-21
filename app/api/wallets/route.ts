import { NextRequest, NextResponse } from 'next/server';
import data from '@/data/data.json';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'demo' or 'main'
    const network = searchParams.get('network'); // 'gemWallet'

    if (!data.configuration?.wallets) {
      return NextResponse.json(
        { error: 'Wallet configuration not found' },
        { status: 404 }
      );
    }

    // If specific type and network requested
    if (type && network) {
      const wallet = data.configuration.wallets[type]?.[network];
      if (!wallet) {
        return NextResponse.json(
          { error: `Wallet not found for type: ${type}, network: ${network}` },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        wallet: wallet,
        type: type,
        network: network
      });
    }

    // Return all wallets
    return NextResponse.json({
      success: true,
      wallets: data.configuration.wallets,
      networks: data.configuration.networks
    });

  } catch (error) {
    console.error('❌ Wallet API error:', error);
    
    return NextResponse.json({
      success: false,
      error: `API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}

// POST endpoint to update wallet information
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, network, walletData } = body;

    if (!type || !network || !walletData) {
      return NextResponse.json(
        { error: 'Missing required fields: type, network, walletData' },
        { status: 400 }
      );
    }

    // In a real app, you would update the database here
    // For now, we'll just return the updated data
    return NextResponse.json({
      success: true,
      message: 'Wallet information updated successfully',
      wallet: {
        type,
        network,
        ...walletData
      }
    });

  } catch (error) {
    console.error('❌ Wallet update error:', error);
    
    return NextResponse.json({
      success: false,
      error: `Update error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
