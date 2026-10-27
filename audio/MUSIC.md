# 음악 · 효과음

파일을 아래 이름으로 넣으면 게임이 알아서 재생합니다. 없는 파일은 그냥 건너뜁니다.
🔊 버튼으로 음성·음악·효과음을 한꺼번에 끄고 켭니다.

## 배경음악 `audio/music/`
| 파일 | 언제 | Suno 프롬프트 예시 |
|---|---|---|
| `lobby.mp3` | 로그인·대기실·결과 화면 | `epic orchestral war drums, anticipation, world map strategy game menu theme, loopable, instrumental, 90 bpm` |
| `battle.mp3` | 게임 중 | `fast heroic orchestral battle music, taiko and brass, mobile strategy game, energetic, loopable, instrumental, 120 bpm` |
| `final.mp3` | 데스매치(10분 이후) | `intense climactic orchestral finale, choir, pounding percussion, high tension, loopable, instrumental, 140 bpm` |

- Suno에서 **Instrumental**을 켜고 만드세요. 2~3분이면 충분하고, 시작과 끝을 잘라 이어 붙이면 반복이 자연스럽습니다.
- 128kbps mp3면 한 곡에 2~3MB 정도입니다.
- 무료 플랜으로 만든 곡은 비상업 용도로만 쓸 수 있습니다. 게임을 유료로 팔거나 광고를 붙이려면 Pro 이상 플랜에서 만든 곡을 쓰세요.

## 효과음 `audio/sfx/`
| 파일 | 언제 |
|---|---|
| `capture.mp3` | 다른 나라 수도를 점령했을 때 |
| `era.mp3` | 새 시대로 넘어갈 때 |
| `win.mp3` | 1등으로 끝났을 때 |
| `lose.mp3` | 1등이 아닌 채로 끝났을 때 |

효과음은 Suno보다 짧은 효과음 전용 도구(예: ElevenLabs Sound Effects)가 더 잘 맞습니다. 0.5~2초 길이면 됩니다.

아티팩트(claude.ai)에서도 쓰려면 이 파일들을 아티팩트에 함께 게시해야 합니다. 받으면 제가 올려 드릴 수 있습니다.
