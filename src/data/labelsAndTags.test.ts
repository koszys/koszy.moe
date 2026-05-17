import { describe, it, expect } from 'vitest';
import { event_labels, game_tags } from './labelsAndTags';

describe('labelsAndTags', () => {
  it('exports event_labels', () => {
    expect(event_labels).toBeDefined();
    expect(event_labels.genshin).toBeDefined();
    expect(event_labels.hsr).toBeDefined();
    expect(event_labels.zzz).toBeDefined();
    expect(event_labels.wuwa).toBeDefined();
  });

  it('exports game_tags', () => {
    expect(game_tags).toBeDefined();
    expect(game_tags.genshin).toBeDefined();
    expect(game_tags.hsr).toBeDefined();
  });

  it('genshin event_labels has VERSION', () => {
    expect(event_labels.genshin.VERSION).toEqual({
      text: "New Version",
      bgColor: "bg-teal-900/40",
      textColor: "text-teal-300"
    });
  });

  it('genshin game_tags has PERMANENT', () => {
    expect(game_tags.genshin.PERMANENT).toEqual({
      id: "permanent",
      text: "Permanent",
      bgColor: "bg-orange-900/40",
      textColor: "text-orange-400"
    });
  });
});