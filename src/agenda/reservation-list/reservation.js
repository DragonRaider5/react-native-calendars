import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {xdateToData} from '../../interface';
import XDate from 'xdate';
import dateutils from '../../dateutils';
import styleConstructor from './style';

class ReservationListItem extends Component {
  constructor(props) {
    super(props);
    this.styles = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps) {
    const r1 = this.props.item;
    const r2 = nextProps.item;
    let changed = true;
    if (!r1 && !r2) {
      changed = false;
    } else if (r1 && r2) {
      if (r1.get('day').getTime() !== r2.get('day').getTime()) {
        changed = true;
      } else if (!r1.has('reservation') && !r2.has('reservation')) {
        changed = false;
      } else if (r1.has('reservation') && r2.has('reservation')) {
        if ((!r1.has('date') && !r2.has('date')) || (r1.has('date') && r2.has('date'))) {
          changed = this.props.rowHasChanged(r1.get('reservation'), r2.get('reservation'));
        }
      }
    }
    return changed;
  }

  renderDate(date, item) {
    if (this.props.renderDay) {
      return this.props.renderDay(date ? xdateToData(date) : undefined, item);
    }
    const today = dateutils.sameDate(date, XDate()) ? this.styles.today : undefined;
    if (date) {
      return (
        <View style={this.styles.day}>
          <Text style={[this.styles.dayNum, today]}>{date.getDate()}</Text>
          <Text style={[this.styles.dayText, today]}>{XDate.locales[XDate.defaultLocale].dayNamesShort[date.getDay()]}</Text>
        </View>
      );
    } else {
      return (
        <View style={this.styles.day}/>
      );
    }
  }

  render() {
    const item = this.props.item;
    let content;
    if (item.has('reservation')) {
      const firstItem = item.get('date') ? true : false;
      content = this.props.renderItem(item.get('reservation'), firstItem, item.get('lastItem'));
    } else {
      content = this.props.renderEmptyDate(item.get('date'));
    }
    return (
      <View style={this.styles.container}>
        {this.renderDate(item.get('date'), item.get('reservation'))}
        <View style={{flex:1}}>
          {content}
        </View>
      </View>
    );
  }
}

export default ReservationListItem;
