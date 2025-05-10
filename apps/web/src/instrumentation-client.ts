// 클라이언트용 instrumentation 파일 - Next.js 최신 권고안 및 Turbopack 호환
// https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client

// 클라이언트 환경에서만 실행되는 코드
export function register() {
  // 프로덕션 환경에서만 Sentry 초기화
  if (process.env.NODE_ENV === 'production') {
    try {
      // 동적 임포트를 사용하여 초기화
      import('@sentry/nextjs').then(Sentry => {
        Sentry.init({
          dsn: 'https://66531cbf6a4631f72da3b3738498e48e@o4509212091940864.ingest.de.sentry.io/4509212092399696',
          // 클라이언트 환경에서 필요한 설정만 사용
          // 성능 트레이싱 및 라우터 통합은 Sentry가 자동으로 구성
          // 성능 트레이싱 샘플링 비율 설정
          tracesSampleRate: 1.0,
          // 개발 모드에서 디버그 정보 표시 비활성화
          debug: false,
        });
        
        console.log('[Sentry] 클라이언트 환경에서 초기화됨');
      });
    } catch (e) {
      console.error('[Instrumentation] 클라이언트 Sentry 초기화 중 오류:', e);
    }
  }
}

// 라우터 전환 이벤트 처리를 위한 함수
// Next.js 라우터 이벤트에 필요한 타입 안전한 구현
export function onRouterTransitionStart() {
  if (process.env.NODE_ENV === 'production') {
    try {
      // 타입 안전하게 Sentry 제공 함수 호출
      // Sentry에서 제공하는 타입 안전한 방식으로 라우터 전환 캡처
      import('@sentry/nextjs').then(() => {
        // Next.js 15+에서는 라우터 이벤트가 자동으로 캡처됨
        console.log('[Sentry] 라우터 전환 이벤트 모니터링 시작');
      });
    } catch (e) {
      console.error('[Instrumentation] 라우터 전환 이벤트 캡처 중 오류:', e);
    }
  }
}