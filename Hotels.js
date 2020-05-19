import React, { Component } from 'react';
import { Container, Button, Icon, Image, Item, Label, Popup, Statistic, Rating } from 'semantic-ui-react';

export default ({ error, isLoaded, hotels }) => {
	if (error) {
		return <p> Error {error.message} </p>
	} else if (!isLoaded) {
		return <p> </p>

	} else {
		return (

			<Item.Group divided style={{ maxWidth: '850px' }}>
				{hotels.map(hotels => (
					<Item key={hotels.id}>
						<Item.Image src={hotels.image} />
						<Item.Content>
							<Statistic color='green' size='small' floated='right'>
								<Statistic.Value>{hotels.statistic}</Statistic.Value>
								<Statistic.Label>Очень хорошо</Statistic.Label>
							</Statistic>

							<Item.Header as='a'>{hotels.name}
								<Rating defaultRating={hotels.raiting} maxRating={hotels.raiting} disabled />

							</Item.Header>

							<Item.Meta>
								<span className='price'>от {hotels.price} грн</span>
							</Item.Meta>

							<p>{hotels.description}</p>

							<Item.Extra>
								<Popup content='Бар' trigger={<Button size='mini' icon='bar' />} />
								<Popup content='Wi-Fi' trigger={<Button size='mini' icon='rss' />} />
								<Popup content='Автостоянка' trigger={<Button size='mini' size='mini' icon='car' />} />
								<Popup content='Ресторан' trigger={<Button size='mini' icon='food' />} />
							</Item.Extra>

							<Button color='brown' floated='right'>
								Забронировать <Icon name='right chevron' />
							</Button>

						</Item.Content>
					</Item>
				))}
			</Item.Group>
		)
	}
}
