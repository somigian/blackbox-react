### Examples

**Standard Use**

Example of a component that opens a modal when a button is clicked

```
import { Button, Modal, RichText, Section } from "blackbox-react";

class ModalExample extends React.Component {
    constructor (props) {
      super(props)
      this.state = { open: false }
      this.openModal = this.openModal.bind(this)
      this.closeModal = this.closeModal.bind(this)
    }

    openModal () {
      this.setState({ open: true })
    }

    closeModal() {
      this.setState({ open: false })
    }

    render () {
      return (
        <div>
          <Button onClick={this.openModal}>Open Modal</Button>
          <Modal
            isOpen={this.state.open}
            onRequestClose={this.closeModal}
            contentLabel='Label'
            appElement='#rsg-root'
            title='Modal Title'>
            <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Sed posuere consectetur est at lobortis. Donec id elit non mi porta gravida at eget metus.</p>
          </Modal>
        </div>
      )
    }
}

<ModalExample />
```

**Example Using Toggle**

Example using the withToggle higher order component

```
import { Button, Modal, RichText, Section, ButtonGroup } from "blackbox-react";

const withToggle = require('../with-toggle').default;

const ModalExample = withToggle((props) => (
  <div>
    <Button onClick={props.onToggleOn}>Open Modal</Button>
    <Modal
      isOpen={props.toggled}
      onRequestClose={props.onToggleOff}
      contentLabel='Label'
      appElement='#rsg-root'
      title='Confirmation Modal'>
      <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Sed posuere consectetur est at lobortis. Donec id elit non mi porta gravida at eget metus.</p>
      <Section 
        className='modal-footer'>
        <ButtonGroup 
          styles={{
            '&': {
              float: 'right',
              marginTop: '10px'
            }
        }}>
          <Button
            onClick={props.onToggleOff}
            background='tertiary'
            foreground='gray06'
            children='Cancel'
            size={-1}
          />
          <Button 
            background='info'
            size={-1}>
            Okay
          </Button>
        </ButtonGroup>
      </Section>
    </Modal>
  </div>
));

<ModalExample />
```

**Custom Example**

Contains some custom spacing, styles and close button

```
import { Button, Modal, RichText, Section, Grid, GridColumn, ButtonGroup } from "blackbox-react";

const withToggle = require('../with-toggle').default;

const styles = {
  content: {
    border: 'none'
  }
}

const ModalExample = withToggle((props) => (
  <div>
    <Button onClick={props.onToggleOn}>Open Modal</Button>
    <Modal
      isOpen={props.toggled}
      onRequestClose={props.onToggleOff}
      spacing={0}
      closeIcon={false}
      styles={styles}
      contentLabel='Modal'
      appElement='#rsg-root' 
      styles={{
        'container': {
          padding: '0'
        }
      }}>
      <div>
        <Section background='primary' foreground='light'>
          <RichText styles={{
            '& h5': {
              margin: '0',
              fontWeight: '500',
              textTransform: 'uppercase'
            }
          }}>
            <h5>Modal Title</h5>
          </RichText>
        </Section>
        <Section>
          <Grid align='stretch' spacing={1}>
            <GridColumn xs={6} 
            styles={{
              '&': {
                marginBottom: '10px'
              }
            }}>
              <RichText>
                <p>Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nullam id dolor id nibh ultricies vehicula ut id elit. Donec sed odio dui.</p>
                <p>Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nullam id dolor id nibh ultricies vehicula ut id elit. Donec sed odio dui.</p>
              </RichText>
            </GridColumn>
            <GridColumn xs={4} background='shade'>
              <ButtonGroup>
                <Button block>Donate</Button>
                <Button block>Register</Button>
                <Button block>Login</Button>
                <Button
                  background='tertiary'
                  foreground='gray06'
                  children='Close'
                  onClick={props.onToggleOff}
                  block
                />
              </ButtonGroup>
            </GridColumn>
          </Grid>
        </Section>
      </div>
    </Modal>
  </div>
));

<ModalExample />
```
