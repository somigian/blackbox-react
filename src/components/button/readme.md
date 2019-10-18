### Examples

**Tag**

Specify the tag or component e.g. a, button, Link etc.

```
import { ButtonGroup, Button } from "blackbox-react";

<ButtonGroup>
  <Button tag='a' href='http://google.com'>I'm an &lt;a&gt; tag</Button>
  <Button tag='button' onClick={() => console.log('clicked')}>I'm a &lt;button&gt;</Button>
  <Button tag='span' onClick={() => console.log('clicked')}>I'm a &lt;span&gt;</Button>
</ButtonGroup>
```

**Colors**

Change the background color to one of the theme's colors

```
import { ButtonGroup, Button } from "blackbox-react";

<ButtonGroup>
  <Button>Default</Button>
  <Button background='success'>Success</Button>
  <Button background='info'>Info</Button>
  <Button background='warning'>Warning</Button>
  <Button background='danger'>Danger</Button>
</ButtonGroup>
```

Change the foreground color to one of the theme's colors

```
import { ButtonGroup, Button } from "blackbox-react";

<ButtonGroup>
  <Button background='light' foreground='dark'>Light</Button>
  <Button background='dark'>Dark</Button>
  <Button background='disabled' foreground='gray03'>Disabled</Button>
</ButtonGroup>
```

**Size**

Alter the font size, using a factor to be passed into the `scale` function

```
import { ButtonGroup, Button } from "blackbox-react";

<ButtonGroup>
  <Button size={-1}>Small</Button>
  <Button size={0}>Default</Button>
  <Button size={1}>Medium</Button>
  <Button size={2}>Large</Button>
</ButtonGroup>
```

**Spacing**

Change the padding of the button by passing in a spacing object or number

```
import { ButtonGroup, Button } from "blackbox-react";

<ButtonGroup>
  <Button spacing={{ x: 1, y: 1 }}>Click Me</Button>
  <Button spacing={{ l: 1, r: 1, b: 1, t: 1 }}>Click Me</Button>
  <Button spacing={1}>Click Me</Button>
</ButtonGroup>
```

**Border**

Set the border width (px) and/or color to one of the theme's colors

```
import { ButtonGroup, Button } from "blackbox-react";

<ButtonGroup>
  <Button borderWidth={3}>Click Me</Button>
  <Button borderWidth={1}>Click Me</Button>
  <Button borderColor='shade'>Click Me</Button>
  <Button borderColor='tint'>Click Me</Button>
</ButtonGroup>
```

**Outline**

```
import { ButtonGroup, Button } from "blackbox-react";

<ButtonGroup>
  <Button background='transparent' foreground='success' borderWidth={3} borderColor='success'>Success</Button>
  <Button background='transparent' foreground='info' borderWidth={3} borderColor='info'>Info</Button>
  <Button background='transparent' foreground='warning' borderWidth={3} borderColor='warning'>Warning</Button>
  <Button background='transparent' foreground='danger' borderWidth={3} borderColor='danger'>Danger</Button>
  <Button background='transparent' foreground='dark' borderWidth={3} borderColor='dark'>Dark</Button>
  <Button background='transparent' foreground='disabled' borderWidth={3} borderColor='disabled'>Disabled</Button>
</ButtonGroup>
```

Border Radius

```
import { ButtonGroup, Button } from "blackbox-react";

<ButtonGroup>
  <Button radius='none'>Click Me</Button>
  <Button radius='small'>Click Me</Button>
  <Button radius='medium'>Click Me</Button>
  <Button radius='large'>Click Me</Button>
</ButtonGroup>
```

**Fonts**

Specify a specific font treatment

```
import { ButtonGroup, Button } from "blackbox-react";

<ButtonGroup>
  <Button>Click Me</Button>
  <Button font='head'>Click Me</Button>
  <Button font='body'>Click Me</Button>
</ButtonGroup>
```
**Hover Effects**

Set the hover effect of the button

```
import { ButtonGroup, Button } from "blackbox-react";

<ButtonGroup>
  <Button>Click Me</Button>
  <Button effect='shade'>Click Me</Button>
  <Button effect='tint'>Click Me</Button>
  <Button effect='grow'>Click Me</Button>
  <Button effect='shrink'>Click Me</Button>
</ButtonGroup>
```

**Custom Styles**

Pass in custom style rules to be applied to the button

```
import { Button } from "blackbox-react";

<Button styles={{
  fontSize: '10px',
  backgroundColor: '#777'
}}>Custom Styles</Button>
```

**Treatments**

The following treatments in your project's traits will be applied:

- `button`
