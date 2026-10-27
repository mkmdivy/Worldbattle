# World Battle · 지구 땅따먹기

English is the default language; Korean can be selected on the start screen or with the 한/EN button.

실제 세계지도 위에서 무작위 국가로 시작해 영토를 넓히는 실시간 땅따먹기 게임입니다. OpenFront 스타일 레이아웃을 따랐습니다.

▶ 혼자 플레이 (GitHub Pages): https://mkmdivy.github.io/Worldbattle/

▶ 친구와 멀티플레이 (claude.ai 아티팩트, 초대된 계정만 접속 가능): https://claude.ai/artifact/1EBcw7TZSm16ipmXU2xYvZ

## 게임 요약
- 육지 칸을 무작위로 뽑아 시작 국가를 정합니다. 큰 나라가 자주 걸리고 작은 나라는 가끔 걸립니다.
- 바티칸·모나코·산마리노·리히텐슈타인·안도라·몰타·싱가포르·나우루는 **슈퍼 국가**입니다.
- 나라마다 모자·옷·무기가 다른 병사, 그 나라 말 한마디(브라우저 음성), 고유 전투 특성(약 60개국 개별 + 지역별)이 있습니다.
- 실제 도시 1,168곳(Natural Earth, 한국어 이름) 위에 도시가 세워집니다. 🏹 도시는 원거리병, 🛡 도시는 근접병을 만듭니다.
- **경제**: 골드는 자동으로 쌓입니다. 유닛 버튼을 한 번 누르면 그 유닛의 **생산 라인**이 켜져 골드가 있는 한 0.5초마다 한 명씩 계속 뽑고, 다시 누르면 멈춥니다(단축키 A·S·D·F, Shift는 5명 즉시 구매).
- **부대 표시**: 가까이 모인 같은 나라 병사는 화면에서 부대로 묶입니다. 5명+ 분대(큰 병사와 인원수), 25명+ 중대(호위병·깃발), 100명+ 군단(호위병 4명·큰 깃발·금테). 멀리서는 25명 이상 무리가 숫자 원으로 보입니다. 표시만 바뀌고 시뮬레이션은 그대로라 멀티 동기화에 영향이 없습니다.
- **유닛 4종**: 🌾 농부(도시 주변 농지에서 일하며 수입 증가, 싸우지 않고 습격 시 도망) · ⚔ 돌격병(땅을 빼앗는 근접병) · 🏹 궁수(원거리) · 🛡 수비병(국경 수비, 단단함, 땅은 못 뺏음). 농업 업그레이드로 수확량이 늘고 농지가 황금빛으로 바뀝니다.
- **테크트리**: 연구 포인트가 차면 세 갈래(각 7단계) 중 다음 기술을 고릅니다. ⚔ 정예(공격·체력 +12%, 장비 외형 강화), 👥 대군(유닛 가격 -10%, 병력 상한 +8%), 🌾 경제(관개·곡물 창고·시장·은행·철도·산업화·자동화). 기술을 얻을수록 다음 기술이 비싸지고, 3개마다 시대가 넘어갑니다.
- **로그인과 순위표**: 시작 화면에서 claude.ai 계정으로 자동 로그인되거나 게스트 닉네임으로 시작합니다. 판이 끝나면 점수(1등 100, 2등 72… + 최고 영토 % + 처치 ÷ 25)가 기록됩니다. 아티팩트의 `db`(scores 컬렉션, 각자 자기 기록만 씀)에 저장되며, 쓸 수 없는 경우(게스트·보기 전용·GitHub Pages)는 이 기기(localStorage)에 저장됩니다.
- **언어**: 영어 기본, 한국어 선택. 나라·도시·문화·특성 이름까지 전환되고, 진행 중인 판에도 바로 적용됩니다.
- 조작은 정책·연구·생산·업그레이드·공격 목표 지정뿐입니다. 손이 바쁘면 🤖 **자동 운영**을 켜서 유닛 구매·업그레이드·연구를 맡기고 공격 목표만 직접 찍을 수 있습니다.
- 모바일: 하단 전체 폭 조작판(유닛 4버튼, 손가락 크기 행동 버튼, 연구 게이지), 가로 화면 전용 배치, 조작판 접기(▾). 업그레이드는 싸우고 있는 병사에게도 즉시 적용되고 외형이 바뀝니다.
- 한 판 약 15~28분(시뮬레이션 중앙값 약 17분). 10분부터 데스매치 3단계, 30분이면 영토 1위 승리, 60% 장악 시 즉시 승리.
- 1등 특전: 다음 판 병력 2배 생산 또는 시작 위치 지정.

## 멀티플레이
claude.ai 아티팩트의 `room` 기능으로 동작하는 **락스텝** 방식입니다.
- 시뮬레이션은 시드 기반 난수와 엔진 간 결과가 같은 연산(`+ - * /`, `Math.sqrt`)만 써서 완전히 결정적입니다.
- 방장은 틱 번호와 최근 명령만 브로드캐스트하고, 모든 참가자가 같은 시뮬레이션을 돌립니다. 참가자 명령은 presence로 방장에게 갑니다.
- 50틱마다 상태 해시를 비교해 어긋나면 알립니다. 방장이 나가면 남은 사람이 이어받습니다.
- 사람이 아무도 플레이하고 있지 않은 판(AI끼리의 판, 또는 사람 나라가 전부 멸망한 판)에 누가 들어오면 바로 새 게임을 엽니다. 사람이 아직 싸우고 있으면 관전하며 다음 판을 기다립니다.
- 아티팩트 밖(파일로 열기, GitHub Pages 등)에서는 `room`이 없어서 혼자 하는 모드로 돌아갑니다.

## 목소리
[audio/README.md](audio/README.md)에 성우 녹음을 넣는 방법이 있습니다. 녹음이 없으면 기기에서 가장 자연스러운 음성(Natural·Neural·Premium)을 자동으로 고릅니다. Windows·Mac의 Edge 브라우저는 Microsoft Natural 음성을 제공해서 가장 자연스럽게 들립니다.

## 구조
```
index.html          빌드 결과 (한 파일로 완결, 이것만 있으면 실행됨)
src/template.html   게임 소스 (HTML/CSS/JS)
data/map.json       0.5° 격자 국가 래스터 (world-atlas 50m → RLE)
data/cities.json    실제 도시 [칸, 한국어 이름, 수도 여부, 인구 등급]
tools/build.js      template + data → index.html
tools/raster.js     국경 데이터 → map.json
tools/cities.js     Natural Earth 도시 → cities.json
test/sim.js         봇끼리 전체 경기 시뮬레이션 (판 길이 측정)
test/mp.js          가짜 room으로 탭 2개 멀티 동기화·방장 인계 테스트
test/restart.js     빈 판 재시작·관전 대기·연구 선택 UI 테스트
test/mockroom.js    BroadcastChannel 기반 가짜 room/user capability
test/perf.js        확대 단계별 프레임 렌더링 시간 측정
audio/              목소리 팩 (LINES.md 대사 목록, README.md 넣는 방법)
```

## 빌드 / 테스트
```bash
npm install
npm run build        # index.html 생성
npm run test:sim     # Playwright로 경기 5판 시뮬레이션
npm run test:mp      # 메시지 30% 유실 상태에서 멀티 동기화 테스트
```
데이터를 다시 만들려면 Natural Earth `ne_50m_populated_places.geojson`을 `ne/`에 넣고 `npm run data:map`, `npm run data:cities`를 실행합니다.

## 데이터 출처
- 국경: [world-atlas](https://github.com/topojson/world-atlas) (Natural Earth 기반)
- 도시: [Natural Earth](https://www.naturalearthdata.com/) 1:50m populated places (퍼블릭 도메인)
- 국가 한국어 이름: [i18n-iso-countries](https://github.com/michaelwittig/node-i18n-iso-countries)
