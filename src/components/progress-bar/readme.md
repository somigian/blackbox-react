### Examples

**Standard Use**

A half filled progress bar.

```
import { ProgressBar } from "blackbox-react";

<ProgressBar
  alt='<%= progress %>% raised'
  progress={50}
/>
```

**Using traits**

Uses custom colors and radiuses as specified by traits

```
import { ProgressBar } from "blackbox-react";

<ProgressBar
  alt='<%= progress %>% raised'
  progress={50}
  background='secondary'
  fill='dark'
  radius='none'
/>
```

**Custom styles**

Apply a custom styles object to alter the look. Available elements are:

- `root` - Container
- `fill` - Progress fill

For example, using a gradient for the progress fill:

```
import { ProgressBar } from "blackbox-react";

<ProgressBar
  alt='<%= progress %>% raised'
  progress={50}
  styles={{
    fill: {
      background: 'linear-gradient(to right, orange , yellow, green, cyan, blue, violet)'
    }
  }}
/>
```
