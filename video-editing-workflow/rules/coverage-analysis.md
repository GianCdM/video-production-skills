# Coverage Analysis

Track how much of each person's content is used in the final edit.

## Formula

```
coverage = sum(segment_durations_for_person) / person_total_duration * 100
```

## Rules

- Aim for **>90%** coverage per person
- If **<80%**, identify what was cut and evaluate if it's thematically important
- Gaps between segments of the same person are OK if they're thematically redundant
- The **LAST person to speak** should ideally have 100% coverage — strong closings matter

## Implementation

```python
from collections import defaultdict

def compute_coverage(segments, durations):
    """
    segments: list of {file, start, end, ...}
    durations: dict of {file: total_duration_sec}
    """
    used = defaultdict(float)
    for seg in segments:
        used[seg['file']] += seg['end'] - seg['start']

    for file, total in durations.items():
        pct = used[file] / total * 100
        status = "✅" if pct >= 90 else ("⚠️" if pct >= 80 else "❌")
        print(f"{status} {file}: {pct:.1f}% ({used[file]:.1f}s / {total:.1f}s)")
```
