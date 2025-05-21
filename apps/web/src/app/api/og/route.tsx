import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // ud0c0uc774ud2c0 uac00uc838uc624uae30
    let title = searchParams.get('title')
    if (!title) {
      title = 'Logme - Notionuc73cub85c ub9ccub4dcub294 ube14ub85cuadf8'
    }

    // ubc30uacbduc0c9uacfc ud3f0ud2b8 uc0c9uc0c1 uac00uc838uc624uae30 (uae30ubcf8uac12uc740 Logme ud14cub9c8 uc0c9uc0c1)
    const bgColor = searchParams.get('bg') || '#ffffff'
    const textColor = searchParams.get('color') || '#000000'
    
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            color: textColor,
            background: bgColor,
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 80px',
            textAlign: 'center',
            fontFamily: 'sans-serif',
          }}
        >
          {/* ub85cuace0 uc601uc5ed */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
            <span style={{ 
              fontSize: 48, 
              fontWeight: 'bold', 
              background: '#000000',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '8px'
            }}>
              Logme
            </span>
          </div>
          
          {/* ud0c0uc774ud2c0 uc601uc5ed */}
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
            <span style={{ 
              fontWeight: 'bold', 
              fontSize: 46,
              lineHeight: 1.2,
            }}>
              {title}
            </span>
          </div>
          
          {/* ud558ub2e8 uc815ubcf4 */}
          <div style={{ 
            position: 'absolute', 
            bottom: 40, 
            fontSize: 24,
            color: textColor,
            opacity: 0.7,
          }}>
            logme.dev
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('OG uc774ubbf8uc9c0 uc0dduc131 uc624ub958:', error)
    return new Response('OG uc774ubbf8uc9c0 uc0dduc131 uc911 uc624ub958uac00 ubc1cuc0ddud588uc2b5ub2c8ub2e4', { status: 500 })
  }
}
