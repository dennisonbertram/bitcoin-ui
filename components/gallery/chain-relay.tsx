export function ChainRelay() {
  return (
    <figure className="chain-relay" aria-labelledby="chain-relay-caption">
      <div className="chain-relay__field" aria-hidden="true">
        <span className="chain-relay__line chain-relay__line--one" />
        <span className="chain-relay__line chain-relay__line--two" />
        <span className="chain-relay__block chain-relay__block--one">
          <span>905,740</span>
          <code>0000…8d1a</code>
        </span>
        <span className="chain-relay__block chain-relay__block--two">
          <span>905,741</span>
          <code>0000…ca91</code>
        </span>
        <span className="chain-relay__block chain-relay__block--three">
          <span>905,742</span>
          <code>0000…f7b2</code>
        </span>
      </div>
      <figcaption id="chain-relay-caption">
        <span>New blocks extend the chain.</span>
        Prior blocks remain verifiable.
      </figcaption>
    </figure>
  );
}
