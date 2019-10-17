### Examples

**Standard Use**

```
import { Button, ButtonGroup } from "blackbox-react";

<ButtonGroup>
  <Button>Click Me</Button>
  <Button>Click Me</Button>
  <Button>Click Me</Button>
</ButtonGroup>
```

**Spacing**

Adjust the spacing between buttons using a spacing object or a number

```
import { Button, ButtonGroup } from "blackbox-react";

<ButtonGroup spacing={{ x: 1, y: 0.25 }}>
  <Button>Click Me</Button>
  <Button>Click Me</Button>
  <Button>Click Me</Button>
</ButtonGroup>
```

**Custom Styles**

Pass in custom style rules to be applied to the group

```
import { Button, ButtonGroup } from "blackbox-react";

<ButtonGroup styles={{ backgroundColor: '#ddd' }}>
  <Button>Click Me</Button>
  <Button>Click Me</Button>
  <Button>Click Me</Button>
</ButtonGroup>
```
