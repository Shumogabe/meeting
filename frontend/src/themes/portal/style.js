import { THEME } from '../../helpers/theme';
class Style {
  bgcolor(){
    return 'background:' + THEME.PORTAL_THEME.COLOR.BACKGROUND;
  }
}
export default new Style();