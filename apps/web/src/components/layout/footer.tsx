export function Footer() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="border-t py-4 text-xs text-muted-foreground flex justify-center gap-4">
        <span>© {currentYear} FLEXYZ</span>
        <a href="/privacy" className="hover:underline">
          개인정보처리방침
        </a>
        <a href="/terms" className="hover:underline">
          이용약관
        </a>
      </footer>
    )
  }