### Examples

**Standard Use**

```
import { Accordion, RichText } from "blackbox-react";

<div>
  <Accordion title='Lorem ipsum dolor sit amet, consectetur adipiscing elit?'>
    <RichText>
      <p>Cras mattis consectetur purus sit amet fermentum. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
    </RichText>
  </Accordion>

  <Accordion title='Purus Lorem Nullam?'>
    <RichText>
      <p>Cras mattis consectetur purus sit amet fermentum. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
    </RichText>
  </Accordion>

  <Accordion title='Morbi leo risus, porta ac consectetur ac, vestibulum at eros, fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.?'>
    <RichText>
      <p>Cras mattis consectetur purus sit amet fermentum. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
    </RichText>
  </Accordion>

  <Accordion title='Lorem ipsum dolor sit amet, consectetur adipiscing elit?'>
    <RichText>
      <p>Cras mattis consectetur purus sit amet fermentum. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
    </RichText>
  </Accordion>
</div>
```

**Default State**

Open the accordion by default

```
import { Accordion, RichText } from "blackbox-react";

<Accordion title='Question here?' toggled>
  <RichText>
    <p>Answer here...</p>
  </RichText>
</Accordion>
```

**Color**

Set the active color of the accordion for the icon and borders

```
import { Accordion, RichText } from "blackbox-react";

<Accordion title='Question here?' color='secondary'>
  <RichText>
    <p>Answer here...</p>
  </RichText>
</Accordion>
```

**Font**

Set the font style for the title

```
import { Accordion, RichText } from "blackbox-react";

<Accordion title='Question here?' font='body'>
  <RichText>
    <p>Answer here...</p>
  </RichText>
</Accordion>
```

**Custom Icons**

Set the open and close icon or text

```
import { Accordion, RichText, Icon } from "blackbox-react";

const opened = 'See Less';
const closed = 'See More';
const plusIcon = <Icon name='plus'/>;
const minusIcon = <Icon name='minus'/>;

<div>
  <Accordion title='This accordion uses custom open and close text' opened={opened} closed={closed}>
    <RichText>
      <p>Cras mattis consectetur purus sit amet fermentum. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
    </RichText>
  </Accordion>

  <Accordion title='This accordion uses plus and minus icons' opened={minusIcon} closed={plusIcon}>
    <RichText>
      <p>Cras mattis consectetur purus sit amet fermentum. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
    </RichText>
  </Accordion>
</div>
```

**Remove Border**

Remove the border from the accordion

```
import { Accordion, RichText } from "blackbox-react";

<Accordion title='Question here?' border={false}>
  <RichText>
    <p>Answer here...</p>
  </RichText>
</Accordion>
```

**Custom Styles**

Apply a custom styles object to alter the look. Available elements are:

- `root` - Containing element
- `head` - Header container
- `toggle` - Header icon
- `title` - Header title text
- `body` - Content body

For example:

```
import { Accordion, RichText } from "blackbox-react";

const styles = {
  head: {
    padding: '1.5em',
    border: '1px solid #eee',
    backgroundColor: '#f6f6f6'
  },
  body: {
    paddingBottom: '1.5em',
    border: '1px solid #eee',
    borderTop: 'none'
  }
};

<Accordion title='Question here?' border={false} styles={styles}>
  <RichText>
    <p>Answer here...</p>
  </RichText>
</Accordion>
```
