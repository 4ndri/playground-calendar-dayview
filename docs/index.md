# Algorithmus zur Positionierung von Ereignissen in der Tagesansicht

Wie können Elemente anhand der Tageszeit und ohne Überschneidungen in der Tagesansicht platziert werden. Folgendes Beispiel zeigt die Tagesansicht aus dem Outlook Kalender.

![Outlook Tagesansicht -width12 -lg:width6][outlook-dayview]

In der Ansicht sind die zusammenhängenden Elemente in Gruppen eingefärbt.

## Elemente anzeigen

In HTML können die einzelnen Elemente mit den Eigenschaften `position, top, bottom, left, right` an die richtige Stelle positioniert werden:

```css
.css-u8wd03-EventEntry {
  position: absolute;
  top: 450px;
  bottom: 749px;
  left: 66.66666666666667%;
  right: 0%;
}
```

## Vertikale Positionierung

für die Vertikale Positionierung muss die Startzeit des Ereignissen in den Top-Offset und die Endzeit in den Bottom-Offset umgewandelt werden. Dazu muss die Höhe des Containers (Tag) auf die 24h eines Tages aufgeteilt werden. Die Platzierung ist dann linear. Am einfachsten ist, wenn der Container einfach 1440px hoch ist (24\*60). Somit ist `1 Minute = 1 Px`. Und sonst relativ in Prozent.

Am besten die Bibliothek ["date-fns"](https://date-fns.org/) für DateTime Funktionen verwenden.

```TypeScript
function startOfDay(d: Date){
  const startOfDay=new Date(d.getFullYear(),d.getMonth(),d.getDate())
  return startOfDay;
}
function differenceInMinutes(a:Date, b:Date){
  const diffMilli = Math.abs(a.getTime() - b.getTime());
  const diff=diffMilli/1000/60;
  return diff;
}
// or date-fns
import { startOfDay, differenceInMinutes, parseISO } from 'date-fns'

export function setVerticalPosition(events: IEvent[]) {
  for (const e of events) {
    e.top = differenceInMinutes(e.startDate, startOfDay(e.startDate));
    e.bottom = differenceInMinutes(endOfDay(e.endDate), e.endDate);
  }
}
```

## Horizontale Positionieren

Komplizierte Sache!!

Im Grunde geht es darum, in einem ersten Schritt die Ereignisse des Tages in die Gruppen aufzuteilen, und danach die Ereignisse in der Gruppe zu positionieren.

![Outlook Tagesansicht -width12 -lg:width6][outlook-dayview]

### 1. Sortieren

Zuerst müssen alle Ereignisse des Tages nach Startzeit aufsteigend sortiert werden (bei gleicher Startzeit wird als zweiter Faktor die Endzeit berücksichtigt).

Diese Sortierung ist für die Vergleiche und Gruppierung der Ereignisse notwendig.

### 2. Gruppieren

### 3. Positionieren

Wir erstellen eine Matrix nach dem folgenden Muster. Das gezeichnete Beispiel entspricht der roten Gruppe aus dem Bild oben (Outlook-Kalender).

![positioning matrix -width12 -lg:width8][calendar-pos-01]

In der Gruppe gibt es 6 Ereignisse, wir machen eine 6x6 Matrix.

- Die Spalten entprechen den horizontalen Positionen. Im ersten Schritt erhält jedes Ereignis seine eigene Spalte (h-Position).
- Die Zeilen entsprechen der Position des Ereignisses in der sortierten Gruppe. Also im Grunde genommen der Beginn eines Ereignisses.

Dann schreiben wir in die Diagonale den jeweiligen index des Ereignisses:

```javascript
m[i][i] = i;
```

Aufgrund der Sortierung können wir dies so tun, und wissen danach, dass z.B. alles unterhalb von Punkt `m[2][2]` chronologisch später oder gleich der Startzeit von "Ereignis 02" ist. Das "Ereignis 03" kommt in die Zeile 3 obwohl die eigentliche Startzeit gleich ist wie die von "02" (wir schauen nur auf den Index in der Gruppe).

Somit haben wir folgendes Bild:

| Col00 | Col01 | Col02 | Col03 | Col04 | Col05 |
|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
|   0   |       |       |       |       |       |
|       |   1   |       |       |       |       |
|       |       |   2   |       |       |       |
|       |       |       |   3   |       |       |
|       |       |       |       |   4   |       |
|       |       |       |       |       |   5   |

Als nächstes vergleichen wir die Ereignisse miteinander. Wenn nun "Ereignis 00" sich mit "Ereignis 01" überschneidet, schreiben wir eine 0 in das Feld `m[1][0]`. Wir prüfen jeweils das Ereignis `i` nur mit den Ereignissen `j > i`. Dies ergibt:

| Col00 | Col01 | Col02 | Col03 | Col04 | Col05 |
| :---: | :---: | :---: | :---: | :---: | :---: |
|   0   |       |       |       |       |       |
|   0   |   1   |       |       |       |       |
|   0   |       |   2   |       |       |       |
|   0   |       |   2   |   3   |       |       |
|       |       |   2   |       |   4   |       |
|       |       |   2   |       |   4   |   5   |

Im nächsten Schritt werden die Spalten reduziert (Ereignisse bei freien Plätzen nach links). Dies sieht bildlich folgendermassen aus:

![Outlook Tagesansicht -width12 -lg:width8][calendar-pos-reduce]

Für jedes Ereignis wird geprüft, welches die erste verfügbare Spalte ist. Wenn eine Spalte weiter links verfügbar ist, so werden die Feld-Einträge verschoben und die aktuelle Spalte gelöscht.

Im letzten Schritt werden Breiten optimiert. Wenn ein Ereignis (Spalte i) über alle Zeilen in der Spalte rechts (Spalte i+1) davon Platz hat, werden die Zeilen des Ereignisses von Spalte i auf Spalte "i+1" dupliziert.

![Outlook Tagesansicht -width12 -lg:width8][calendar-pos-expand]

### Implementation

```typescript
function setHorizontalPositions(events: IEvent[]) {
  const groups: Array<IEvent[]> = [];
  let group: IEvent[] = [];

  //form groups and compare events
  for (let x = 0; x < events.length; x++) {
    const xe = events[x];
    if (!xe.before || !xe.before.length) {
      group = [];
      groups.push(group);
    }
    group.push(xe);
    for (let y = x + 1; y < events.length; y++) {
      const ye = events[y];
      if (
        areIntervalsOverlapping(
          { start: xe.startDate, end: xe.endDate },
          { start: ye.startDate, end: ye.endDate }
        )
      ) {
        xe.after.push(ye);
        ye.before.push(xe);
      } else {
        // following events won't overlap too (array is sorted)
        break;
      }
    }
  }

  for (const g of groups) {
    const matrix: Array<number[]> = [];
    let max = -1;
    const columns: Array<IEvent[]> = [];

    // build matrix
    for (var i = 0; i < g.length; i++) {
      matrix[i] = new Array(g.length);
    }

    // fill matrix and reduce columns
    for (var i = 0; i < g.length; i++) {
      const xe = g[i];
      let freeCol = i;
      for (let c = 0; c < g.length; c++) {
        if (!matrix[c][i]) {
          freeCol = c;
          break;
        }
      }
      if (max < freeCol) {
        max = freeCol;
        columns.push([]);
      }
      columns[freeCol].push(xe);
      for (let j = i; j <= i + (xe?.after?.length || 0); j++) {
        matrix[freeCol][j] = 1;
      }
    }

    // expand events width
    const width = 100 / columns.length;
    for (let i = 0; i < columns.length; i++) {
      for (const e of columns[i]) {
        e.left = i * width;
        e.right = Math.max(100 - (i + 1) * width, 0);
        for (let j = i + 1; j < columns.length; j++) {
          if (
            columns[j].some(
              (c) => e.after.indexOf(c) > -1 || e.before.indexOf(c) > -1
            )
          ) {
            break;
          } else {
            e.right = Math.max(100 - (j + 1) * width, 0);
          }
        }
      }
    }
  }

  return events;
}
```

### Resultat

Eine Beispiel-Implementation sieht folgendermassen aus:

![Beispiel Resultat -width6 -lg:width3][calendar-result]


## Optimieren

mögliche Grenzfälle finden


<!-- images -->
[outlook-dayview]: images/outlook-day-events.png
[calendar-pos-01]: images/calendar-positioning-01.jpg
[calendar-pos-reduce]: images/calendar-reduce-cols.jpg
[calendar-pos-expand]: images/calendar-pos-expand.jpg
[calendar-result]: images/calendar-pos-result.jpg
