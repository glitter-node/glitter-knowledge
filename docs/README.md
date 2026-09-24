# Glitter Knowledge Developer Documentation

이 디렉터리는 Glitter Knowledge의 개발자 문서 진입점입니다. 패키지 개요와 현재 runtime contract는 [상위 README](../README.md)에 정리되어 있습니다.

## Source flow

Bundled source가 source of truth입니다.

`src` → static build → `dist` → 공식 template lifecycle → installed template

`dist`와 installed template은 생성 결과이므로 직접 수정하지 않습니다. runtime 변경은 기존 G7 layout, component registry, translation, `gk-*` CSS scope를 보존해야 합니다.

## Validation

frontend 변경은 `npm run type-check`와 `npm run build` 결과로 검증합니다. `npm run dev`는 사용하지 않습니다. production checkout에서는 테스트가 production과 구조적으로 격리되었음을 증명할 수 없으면 `SKIPPED: production isolation could not be proven`으로 처리합니다.

추가적인 Knowledge-specific architecture 문서는 실제 contract가 확정될 때 이 디렉터리에 추가합니다.
