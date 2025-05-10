/* eslint-disable @typescript-eslint/no-explicit-any */
// Next.js instrumentation 파일 - Sentry 설정 통합 (서버/엣지)

// register 함수는 서버와 엣지 환경에서 실행됩니다
export async function register() {
  // 프로덕션 환경에서만 Sentry 초기화
  if (process.env.NODE_ENV === 'production') {
    try {
      // Sentry를 동적으로 가져와서 초기화
      const Sentry = await import('@sentry/nextjs');
      
      // 런타임 환경에 따라 적절한 설정 적용
      const options = {
        dsn: 'https://66531cbf6a4631f72da3b3738498e48e@o4509212091940864.ingest.de.sentry.io/4509212092399696',
        tracesSampleRate: 1,
        debug: false,
      };

      if (process.env.NEXT_RUNTIME === 'nodejs') {
        // 서버 환경 설정
        Sentry.init(options);
        console.log('[Sentry] 서버 환경에서 초기화됨');
      }

      if (process.env.NEXT_RUNTIME === 'edge') {
        // 엣지 환경 설정
        Sentry.init(options);
        console.log('[Sentry] 엣지 환경에서 초기화됨');
      }
    } catch (e) {
      // 개발 환경에서는 오류 무시
      console.error('[Instrumentation] Sentry 초기화 중 오류:', e);
    }
  }
}

// Sentry의 captureRequestError에서 요구하는 타입 정의
type RequestInfo = any; // Request 또는 string 타입
type ErrorContext = any; // Sentry가 요구하는 오류 컨텍스트

// 요청 오류 처리를 위한 핸들러 - 명시적인 타입으로 정의
export function onRequestError(error: unknown, request: RequestInfo, errorContext: ErrorContext) {
  if (process.env.NODE_ENV === 'production') {
    // 프로덕션에서는 Sentry의 captureRequestError 사용
    try {
      // 프로덕션 환경에서 동적 import 사용
      import('@sentry/nextjs').then(Sentry => {
        // 명시적인 파라미터로 Sentry 함수 호출
        Sentry.captureRequestError(error, request, errorContext);
      });
    } catch (e) {
      console.error('[Instrumentation] Sentry 오류 캡처 중 오류:', e);
    }
  } else {
    // 개발 환경에서는 콘솔에 로깅
    console.error('[Instrumentation] 요청 오류:', { error, request, errorContext });
  }
}
