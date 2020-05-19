import PropTypes from 'prop-types'
import Hotels from './Hotels';
import React, { Component } from 'react'
import {
  Button,
  Checkbox,
  Grid,
  Header,
  Item,
  Container,
  List,
  Segment,
  Sidebar,
  Responsive,
} from 'semantic-ui-react'

const VerticalSidebar = ({ animation, direction, visible, onChangeFilterStars, onChangeFilterPrice, onChangeSortBy, sortBy }) => {

  return <Sidebar
    animation={animation}
    direction={direction}
    vertical
    visible={visible}
    style={{ width: '200px' }}
  >
    <Item.Group>
      <Item>
        <Item.Content>
          <Header as='h3' color='brown' block style={{ width: '100%', border: 'none', borderRadius: '0px' }}>Цена за ночь</Header>
          <List floated='left' style={{ marginLeft: '10px' }}>
            <List.Item><Checkbox label='от 200 до 400 грн' value={'200, 400'} onChange={onChangeFilterPrice} /></List.Item>
            <List.Item><Checkbox label='от 400 до 750 грн' value={'400, 750'} onChange={onChangeFilterPrice} /></List.Item>
            <List.Item><Checkbox label='от 750 до 1500 грн' value={'750, 1500'} onChange={onChangeFilterPrice} /></List.Item>
            <List.Item><Checkbox label='дороже 1500 грн' value={'1500, 10000000'} onChange={onChangeFilterPrice} /></List.Item>
          </List>
        </Item.Content>
      </Item>
      <Item>
        <Item.Content>
          <Header as='h3' color='brown' block style={{ width: '100%', border: 'none', borderRadius: '0px' }}>Количество звезд</Header>
          <List floated='left' style={{ marginLeft: '10px' }}>
            <List.Item><Checkbox label='2 звезды' value={2} onChange={onChangeFilterStars} /></List.Item>
            <List.Item><Checkbox label='3 звезды' value={3} onChange={onChangeFilterStars} /></List.Item>
            <List.Item><Checkbox label='4 звезды' value={4} onChange={onChangeFilterStars} /></List.Item>
            <List.Item><Checkbox label='5 звезд' value={5} onChange={onChangeFilterStars} /></List.Item>
            <List.Item><Checkbox label='без звезд' value={0} onChange={onChangeFilterStars} /></List.Item>
          </List>
        </Item.Content>
      </Item>
      <Item>
        <Item.Content>
          <Header as='h3' color='brown' block style={{ width: '100%', border: 'none', borderRadius: '0px' }}>Сортировать по</Header>
          <List floated='left' style={{ marginLeft: '10px' }} >
            <List.Item><Checkbox label='звезды' value={'raiting'} checked={sortBy === 'raiting'} onChange={onChangeSortBy} /></List.Item>
            <List.Item><Checkbox label='цена' value={'price'} checked={sortBy === 'price'} onChange={onChangeSortBy} /></List.Item>
          </List>
        </Item.Content>
      </Item>
    </Item.Group>
  </Sidebar>
}

VerticalSidebar.propTypes = {
  animation: PropTypes.string,
  direction: PropTypes.string,
  visible: PropTypes.bool,
};


function SetFireButton(props) {
  return (<button className="sidebar-visible" onClick={props.onClick}>Скрыть</button>);
};

function SnuffOutButton(props) {
  return (<button className="sidebar-visible" onClick={props.onClick}>Показать</button>);
};

export default class SidebarTransitions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      hotels: [],
      filteredState: {
        price: [],
        stars: []
      },
      sortBy: '',
      filteredHotels: [],
      animation: 'push',
      direction: 'left',
      visible: true,
      isBurning: true,
      visible: true
    }
    this.onSetFire = this.onSetFire.bind(this);
    this.onSnuffOut = this.onSnuffOut.bind(this);
  };

  componentDidMount() {
    this.getHotels();
  }

  getHotels() {
    fetch('http://localhost:8000/api/hotels')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            hotels: result.hotels
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  onSetFire() {
    this.setState({ isBurning: true });
  };

  onSnuffOut() {
    this.setState({ isBurning: false });
  };

  onChangeFilterStars = (e, data) => {
    const { value } = data;
    let { filteredState } = this.state;
    if (filteredState['stars'].includes(value)) {
      filteredState['stars'].splice(filteredState['stars'].indexOf(value), 1)
    } else {
      filteredState['stars'].push(value);
    }
    this.filterByState(filteredState);
    this.setState({ filteredState });
  }

  onChangeFilterPrice = (e, data) => {
    const { value } = data;
    let { filteredState } = this.state;
    if (filteredState['price'].includes(value)) {
      filteredState['price'].splice(filteredState['price'].indexOf(value), 1)
    } else {
      filteredState['price'].push(value);
    }
    this.filterByState(filteredState);
    this.setState({ filteredState });
  }

  filterByState = (filteredState) => {
    let { hotels } = this.state;
    const filteredHotelsByPrice = [];
    filteredState['price'].map(pricesRange => {
      const pricesBetween = pricesRange.split(',');
      const findedHotels = hotels.filter(hotel => hotel.price >= pricesBetween[0] && hotel.price < pricesBetween[1]);
      filteredHotelsByPrice.push(...findedHotels);
    });
    const filteredHotelsByStars = hotels.filter(hotel => filteredState['stars'].includes(hotel.raiting));
    const concatinatedFilters = filteredHotelsByPrice.concat(filteredHotelsByStars);
    const filteredHotels = concatinatedFilters.filter((item, pos) => concatinatedFilters.indexOf(item) === pos)
    this.setState({ filteredHotels });
  }

  onChangeSortBy = (e, data) => {
    const { value } = data;
    let { hotels, filteredHotels, filteredState, sortBy } = this.state;
    if (sortBy === value) {
      filteredHotels = [...hotels];
      sortBy = '';
    } else {
      sortBy = value;
      filteredHotels = (filteredState['stars'].length && filteredState['price'].length) ? filteredHotels : hotels;
      filteredHotels.map(first => console.log(first[value]))
      filteredHotels.sort((first, second) => second[value] - first[value])
      filteredHotels.map(first => console.log(first[value]))
    }
    this.setState({ filteredHotels, sortBy });
  }

  handleAnimationChange = (animation) => () =>
    this.setState((prevState) => ({ animation, visible: !prevState.visible }));

  handleDirectionChange = (direction) => () =>
    this.setState({ direction, visible: false });

  render() {
    const {
      animation,
      direction,
      visible,
      lable,
      error,
      isLoaded,
      hotels,
      filteredHotels,
      filteredState,
      sortBy
    } = this.state;
    const vertical = direction === 'bottom' || direction === 'top';
    const isBurning = this.state.isBurning;

    let button = null;
    if (isBurning) {
      button = <SnuffOutButton onClick={this.onSnuffOut} />
    } else {
      button = <SetFireButton onClick={this.onSetFire} />
    }

    return (
      <div>
        <Responsive {...Responsive.onlyMobile}>
          <Button style={{ borderRadius: '0px', padding: '0px', height: '40px', width: '200px' }} onClick={this.handleAnimationChange('push')}>{button}</Button>
        </Responsive>
        <Responsive {...Responsive.onlyTablet}>
          <Button style={{ borderRadius: '0px', padding: '0px', height: '40px', width: '200px' }} onClick={this.handleAnimationChange('push')}>{button}</Button>
        </Responsive>

        <Sidebar.Pushable as={Segment} style={{ borderRadius: '0px', minHeight: '570px' }}>
          {vertical ? null : (
            <VerticalSidebar
              animation={animation}
              direction={direction}
              visible={visible}
              onChangeFilterStars={this.onChangeFilterStars.bind(this)}
              onChangeFilterPrice={this.onChangeFilterPrice.bind(this)}
              onChangeSortBy={this.onChangeSortBy.bind(this)}
              sortBy={sortBy}
            />
          )}

          <Sidebar.Pusher>
            <Segment basic>
              <Hotels
                error={error}
                isLoaded={isLoaded}
                hotels={(filteredHotels.length || (filteredState['stars'].length && filteredState['price'].length)) ? filteredHotels : hotels}
              />
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}
