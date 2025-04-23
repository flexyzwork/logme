.PHONY: tree
tree:
	@tree -I "$$(git check-ignore *)"

.PHONY: code
code:
	@echo "⚠️  이 명령어는 다음 폴더를 삭제합니다: node_modules, .next, .turbo, dist, build"
	@read -p "계속 진행할까요? (y/N): " confirm; if [ "$$confirm" = "y" ]; then \
		find . -type d \( -name "node_modules" -o -name ".next" -o -name ".turbo" -o -name "dist" -o -name "build" \) -exec rm -rf {} + ; \
	else \
		echo "🚫 삭제를 취소했습니다."; \
	fi