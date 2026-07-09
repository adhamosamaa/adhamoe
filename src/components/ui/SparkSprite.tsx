/** Defines the reusable "spark" glyph once; consumed everywhere via <SparkIcon />. */
export function SparkSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <symbol id="spark" viewBox="0 0 24 24">
        <path d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z" />
      </symbol>
    </svg>
  );
}
