# 지구 땅따먹기 (Earth Conquest)

실제 세계지도 위에서 무작위 국가로 시작해 영토를 넓히는 실시간 땅따먹기 게임입니다. OpenFront 스타일 레이아웃을 따랐습니다.

▶ 혼자 플레이 (GitHub Pages): https://mkmdivy.github.io/Worldbattle/

▶ 친구와 멀티플레이 (claude.ai 아티팩트, 초대된 계정만 접속 가능): https://claude.ai/artifact/1EBcw7TZSm16ipmXU2xYvZ

## 게임 요약
- 육지 칸을 무작위로 뽑아 시작 국가를 정합니다. 큰 나라가 자주 걸리고 작은 나라는 가끔 걸립니다.
- 바티칸·모나코·산마리노·리히텐슈타인·안도라·몰타·싱가포르·나우루는 **슈퍼 국가**입니다.
- 나라마다 모자·옷·무기가 다른 병사, 그 나라 말 한마디(브라우저 음성), 고유 전투 특성(약 60개국 개별 + 지역별)이 있습니다.
- 실제 도시 1,168곳(Natural Earth, 한국어 이름) 위에 도시가 세워집니다. 🏹 도시는 원거리병, 🛡 도시는 근접병을 만듭니다.
- 조작은 생산·업그레이드·공격 목표 지정뿐입니다. 업그레이드는 싸우고 있는 병사에게도 즉시 적용되고 외형이 바뀝니다.
- 한 판 약 10~15분. 10분부터 데스매치 3단계, 30분이면 영토 1위 승리, 60% 장악 시 즉시 승리.
- 1등 특전: 다음 판 병력 2배 생산 또는 시작 위치 지정.

## 멀티플레이
claude.ai 아티팩트의 `room` 기능으로 동작하는 **락스텝** 방식입니다.
- 시뮬레이션은 시드 기반 난수와 엔진 간 결과가 같은 연산(`+ - * /`, `Math.sqrt`)만 써서 완전히 결정적입니다.
- 방장은 틱 번호와 최근 명령만 브로드캐스트하고, 모든 참가자가 같은 시뮬레이션을 돌립니다. 참가자 명령은 presence로 방장에게 갑니다.
- 50틱마다 상태 해시를 비교해 어긋나면 알립니다. 방장이 나가면 남은 사람이 이어받습니다.
- 아티팩트 밖(파일로 열기, GitHub Pages 등)에서는 `room`이 없어서 혼자 하는 모드로 돌아갑니다.

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
test/mockroom.js    BroadcastChannel 기반 가짜 room/user capability
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
