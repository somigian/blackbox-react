### Examples

**Social Links**

Links to the required social profiles

```
import { ButtonGroup, ButtonShare } from "blackbox-react";

<ButtonGroup align='center'>
  <ButtonShare type='facebook' href='http://facebook.com' text='Like on Facebook' />
  <ButtonShare type='instagram' href='http://instagram.com' text='Follow us on Instagram'/>
  <ButtonShare type='youtube' href='http://youtube.com' text='Subscribe to our Channel'/>
  <ButtonShare type='twitter' href='http://twitter.com' text='Follow us on Twitter' />
</ButtonGroup>
```

**External Share**

Share the current page on supported social networks or via email

```
import { ButtonGroup, ButtonShare } from "blackbox-react";

<ButtonGroup align='center'>
  <ButtonShare type='facebook' share />
  <ButtonShare type='twitter' url='https://everydayhero.com' title='Everydayhero' share />
  <ButtonShare type='linkedin' share />
  <ButtonShare type='reddit' share />
  <ButtonShare type='pinterest' share />
  <ButtonShare type='mail' share />
  <ButtonShare type='messenger' share />
  <ButtonShare type='sms' share />
  <ButtonShare type='whatsapp' share />
</ButtonGroup>
```

**Custom Styles**

Takes styles the same as a `Button` component

```
import { ButtonShare } from "blackbox-react";

<ButtonShare type='facebook' share styles={{ backgroundColor: 'blue' }} />
```
