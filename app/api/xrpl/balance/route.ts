import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Address parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Try multiple XRPL endpoints
    const endpoints = [
      'https://s.altnet.rippletest.net:51234/',
      'https://testnet.xrpl.org/',
      'https://s1.ripple.com:51234/'
    ];

    let response = null;
    let data = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Trying XRPL endpoint: ${endpoint}`);
        
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            method: 'account_info',
            params: [
              {
                account: address,
                strict: true,
                ledger_index: 'current',
                queue: true
              }
            ]
          })
        });

        if (response.ok) {
          data = await response.json();
          if (data.result && data.result.account_data && data.result.account_data.Balance) {
            const balanceInDrops = parseInt(data.result.account_data.Balance);
            const balanceInXRP = (balanceInDrops / 1000000).toFixed(2);
            
            console.log(`✅ XRPL balance fetched: ${balanceInXRP} XRP`);
            
            return NextResponse.json({
              success: true,
              balance: balanceInXRP,
              address: address,
              endpoint: endpoint
            });
          }
        }
      } catch (error) {
        console.log(`❌ Endpoint ${endpoint} failed:`, error);
        continue;
      }
    }

    // If all endpoints fail, return error instead of fallback
    console.log('❌ All XRPL endpoints failed for address:', address);
    
    return NextResponse.json({
      success: false,
      error: 'Unable to fetch XRPL balance - all endpoints failed',
      address: address,
      endpoints_tried: endpoints.length
    }, { status: 503 });

  } catch (error) {
    console.error('❌ XRPL balance fetch error:', error);
    
    return NextResponse.json({
      success: false,
      error: `API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      address: address
    }, { status: 500 });
  }
}
