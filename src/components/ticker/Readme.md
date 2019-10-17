### Examples

**Standard Use**

```
import { Ticker } from "blackbox-react";

<Ticker
  items={['Person A: $50', 'Person B: $150', 'Person C: $10', 'Person A: $50', 'Person B: $150', 'Person C: $10', 'Person A: $50', 'Person B: $150', 'Person C: $10']}
  label='Latest Donations'
/>
```

**Custom speed / colours**

```
import { Ticker } from "blackbox-react";

<Ticker
  background='secondary'
  foreground='light'
  speed='fast'
  items={['Person A: $50', 'Person B: $150', 'Person C: $10', 'Person A: $50', 'Person B: $150', 'Person C: $10', 'Person A: $50', 'Person B: $150', 'Person C: $10']}
/>
```
