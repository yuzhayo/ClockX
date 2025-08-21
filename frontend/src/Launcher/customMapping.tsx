export interface Coordinates {
  x: number; // percentage from center (-100 to 100)
  y: number; // percentage from center (-100 to 100)
}

export interface CSSPosition {
  left: string;
  top: string;
}

/**
 * Custom Coordinate System
 * Origin (0,0) = center of screen
 * +X = right, -X = left from center
 * +Y = down, -Y = up from center
 * All values in percentages
 */

export class CustomMapping {
  /**
   * Convert custom coordinates to CSS position
   * @param coords Custom coordinates {x, y}
   * @returns CSS position {left, top} as percentage strings
   */
  static toCSS(coords: Coordinates): CSSPosition {
    const left = 50 + coords.x; // 50% (center) + offset
    const top = 50 + coords.y;  // 50% (center) + offset
    
    return {
      left: `${Math.max(0, Math.min(100, left))}%`,
      top: `${Math.max(0, Math.min(100, top))}%`
    };
  }

  /**
   * Convert CSS position back to custom coordinates
   * @param cssPos CSS position {left, top} as percentage strings
   * @returns Custom coordinates {x, y}
   */
  static fromCSS(cssPos: CSSPosition): Coordinates {
    const leftPercent = parseFloat(cssPos.left);
    const topPercent = parseFloat(cssPos.top);
    
    return {
      x: leftPercent - 50,
      y: topPercent - 50
    };
  }

  /**
   * Calculate position for responsive aspect ratio
   * @param coords Custom coordinates
   * @param containerWidth Container width in pixels
   * @param containerHeight Container height in pixels
   * @returns CSS position optimized for aspect ratio
   */
  static toResponsiveCSS(
    coords: Coordinates, 
    containerWidth: number, 
    containerHeight: number
  ): CSSPosition {
    // Maintain 1:1 aspect ratio
    const isPortrait = containerHeight > containerWidth;
    const baseSize = isPortrait ? containerWidth : containerHeight;
    
    // Calculate offset based on device orientation
    const xOffset = (containerWidth - baseSize) / 2 / containerWidth * 100;
    const yOffset = (containerHeight - baseSize) / 2 / containerHeight * 100;
    
    const left = 50 + coords.x * (baseSize / containerWidth) + (isPortrait ? 0 : xOffset);
    const top = 50 + coords.y * (baseSize / containerHeight) + (!isPortrait ? 0 : yOffset);
    
    return {
      left: `${Math.max(0, Math.min(100, left))}%`,
      top: `${Math.max(0, Math.min(100, top))}%`
    };
  }

  /**
   * Get center dot position (always center of screen)
   */
  static getCenterDotPosition(): CSSPosition {
    return {
      left: '50%',
      top: '50%'
    };
  }

  /**
   * Calculate distance between two custom coordinates
   * @param coord1 First coordinate
   * @param coord2 Second coordinate
   * @returns Distance in percentage units
   */
  static distance(coord1: Coordinates, coord2: Coordinates): number {
    const dx = coord2.x - coord1.x;
    const dy = coord2.y - coord1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}