import { API_URL, MOD, PREFIX } from "../config";
import { MOD_FUNC } from "./function";
export const API = {
  AUTH: {
    SIGNIN: API_URL + PREFIX + MOD_FUNC.AUTH + PREFIX + MOD_FUNC.METHOD.SIGNIN,
    SIGNOUT:
      API_URL + PREFIX + MOD_FUNC.AUTH + PREFIX + MOD_FUNC.METHOD.SIGNOUT,
    REGISTER:
      API_URL + PREFIX + MOD_FUNC.AUTH + PREFIX + MOD_FUNC.METHOD.REGISTER,
  },
  CONFIG: {
    GETALL:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.CONFIG +
      PREFIX +
      MOD_FUNC.METHOD.GETALL,
    GETALL_FILTER:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.CONFIG +
      PREFIX +
      MOD_FUNC.METHOD.GETALL_FILTER,
    CREATE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.CONFIG +
      PREFIX +
      MOD_FUNC.METHOD.CREATE,
    EDIT:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.CONFIG +
      PREFIX +
      MOD_FUNC.METHOD.EDIT,
    DELETE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.CONFIG +
      PREFIX +
      MOD_FUNC.METHOD.DELETE,
    READ:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.CONFIG +
      PREFIX +
      MOD_FUNC.METHOD.READ,
    SEARCH:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.CONFIG +
      PREFIX +
      MOD_FUNC.METHOD.SEARCH,
  },
  MODULE: {
    GETALL:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.MODULE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL,
    GETALL_FILTER:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.MODULE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL_FILTER,
    CREATE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.MODULE +
      PREFIX +
      MOD_FUNC.METHOD.CREATE,
    EDIT:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.MODULE +
      PREFIX +
      MOD_FUNC.METHOD.EDIT,
    DELETE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.MODULE +
      PREFIX +
      MOD_FUNC.METHOD.DELETE,
    READ:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.MODULE +
      PREFIX +
      MOD_FUNC.METHOD.READ,
    SEARCH:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.MODULE +
      PREFIX +
      MOD_FUNC.METHOD.SEARCH,
  },
  LAYOUT: {
    GETALL:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.LAYOUT +
      PREFIX +
      MOD_FUNC.METHOD.GETALL,
    GETALL_FILTER:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.LAYOUT +
      PREFIX +
      MOD_FUNC.METHOD.GETALL_FILTER,
    GETBY_ID:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.LAYOUT +
      PREFIX +
      MOD_FUNC.METHOD.GETBY_ID,
    GETBY_NAME:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.LAYOUT +
      PREFIX +
      MOD_FUNC.METHOD.GETBY_NAME,
    CREATE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.LAYOUT +
      PREFIX +
      MOD_FUNC.METHOD.CREATE,
    EDIT:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.LAYOUT +
      PREFIX +
      MOD_FUNC.METHOD.EDIT,
    DELETE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.LAYOUT +
      PREFIX +
      MOD_FUNC.METHOD.DELETE,
    READ:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.LAYOUT +
      PREFIX +
      MOD_FUNC.METHOD.READ,
    SEARCH:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.LAYOUT +
      PREFIX +
      MOD_FUNC.METHOD.SEARCH,
  },
  WIDGET: {
    GETALL:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.WIDGET +
      PREFIX +
      MOD_FUNC.METHOD.GETALL,
    GETALL_FILTER:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.WIDGET +
      PREFIX +
      MOD_FUNC.METHOD.GETALL_FILTER,
    GETBY_LAYOUT_NAME:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.WIDGET +
      PREFIX +
      MOD_FUNC.METHOD.GETBY_LAYOUT_NAME,
    GETBY_LAYOUT:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.WIDGET +
      PREFIX +
      MOD_FUNC.METHOD.GETBY_LAYOUT,
    CREATE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.WIDGET +
      PREFIX +
      MOD_FUNC.METHOD.CREATE,
    EDIT:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.WIDGET +
      PREFIX +
      MOD_FUNC.METHOD.EDIT,
    DELETE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.WIDGET +
      PREFIX +
      MOD_FUNC.METHOD.DELETE,
    READ:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.WIDGET +
      PREFIX +
      MOD_FUNC.METHOD.READ,
    SEARCH:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.WIDGET +
      PREFIX +
      MOD_FUNC.METHOD.SEARCH,
  },
  PAGE_WIDGET: {
    GETALL:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.PAGE_WIDGET +
      PREFIX +
      MOD_FUNC.METHOD.GETALL,
    GETALL_FILTER:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.PAGE_WIDGET +
      PREFIX +
      MOD_FUNC.METHOD.GETALL_FILTER,
    GETBY_LAYOUT_NAME:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.PAGE_WIDGET +
      PREFIX +
      MOD_FUNC.METHOD.GETBY_LAYOUT_NAME,
    GETBY_LAYOUT:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.PAGE_WIDGET +
      PREFIX +
      MOD_FUNC.METHOD.GETBY_LAYOUT,
    CREATE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.PAGE_WIDGET +
      PREFIX +
      MOD_FUNC.METHOD.CREATE,
    EDIT:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.PAGE_WIDGET +
      PREFIX +
      MOD_FUNC.METHOD.EDIT,
    DELETE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.PAGE_WIDGET +
      PREFIX +
      MOD_FUNC.METHOD.DELETE,
    READ:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.PAGE_WIDGET +
      PREFIX +
      MOD_FUNC.METHOD.READ,
    SEARCH:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.PAGE_WIDGET +
      PREFIX +
      MOD_FUNC.METHOD.SEARCH,
  },
  LANGUAGE: {
    GETALL:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.LANGUAGE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL,
    GETALL_FILTER:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.LANGUAGE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL_FILTER,
    CREATE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.LANGUAGE +
      PREFIX +
      MOD_FUNC.METHOD.CREATE,
    EDIT:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.LANGUAGE +
      PREFIX +
      MOD_FUNC.METHOD.EDIT,
    DELETE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.LANGUAGE +
      PREFIX +
      MOD_FUNC.METHOD.DELETE,
    READ:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.LANGUAGE +
      PREFIX +
      MOD_FUNC.METHOD.READ,
    SEARCH:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.LANGUAGE +
      PREFIX +
      MOD_FUNC.METHOD.SEARCH,
  },
  ORGAN: {
    GETALL:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ORGAN +
      PREFIX +
      MOD_FUNC.METHOD.GETALL,
    GETALL_FILTER:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ORGAN +
      PREFIX +
      MOD_FUNC.METHOD.GETALL_FILTER,
    CREATE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ORGAN +
      PREFIX +
      MOD_FUNC.METHOD.CREATE,
    EDIT:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ORGAN +
      PREFIX +
      MOD_FUNC.METHOD.EDIT,
    DELETE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ORGAN +
      PREFIX +
      MOD_FUNC.METHOD.DELETE,
    READ:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ORGAN +
      PREFIX +
      MOD_FUNC.METHOD.READ,
    SEARCH:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ORGAN +
      PREFIX +
      MOD_FUNC.METHOD.SEARCH,
  },
  USER: {
    GETALL:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.USER +
      PREFIX +
      MOD_FUNC.METHOD.GETALL,
    GETALL_FILTER:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.USER +
      PREFIX +
      MOD_FUNC.METHOD.GETALL_FILTER,
    GETBY_FULLNAME:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.USER +
      PREFIX +
      MOD_FUNC.METHOD.GETBY_FULLNAME,
    GETBY_SEARCH:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.USER +
      PREFIX +
      MOD_FUNC.METHOD.GETBY_SEARCH,
    GETBY_ID:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.USER +
      PREFIX +
      MOD_FUNC.METHOD.GETBY_ID,
    CREATE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.USER +
      PREFIX +
      MOD_FUNC.METHOD.CREATE,
    EDIT:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.USER +
      PREFIX +
      MOD_FUNC.METHOD.EDIT,
    DELETE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.USER +
      PREFIX +
      MOD_FUNC.METHOD.REMOVE,
    READ:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.USER +
      PREFIX +
      MOD_FUNC.METHOD.READ,
    SEARCH:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.USER +
      PREFIX +
      MOD_FUNC.METHOD.SEARCH,
    FILTER:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.USER +
      PREFIX +
      MOD_FUNC.METHOD.FILTER,
    UPDATE_ROLE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.USER +
      PREFIX +
      MOD_FUNC.METHOD.UPDATE_ROLE,
    UPDATE_POSITION:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.USER +
      PREFIX +
      MOD_FUNC.METHOD.UPDATE_POSITION,
    UPDATE_ORGAN:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.USER +
      PREFIX +
      MOD_FUNC.METHOD.UPDATE_ORGAN,
  },
  POSITION: {
    GETALL:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.POSITION +
      PREFIX +
      MOD_FUNC.METHOD.GETALL,
    GETALL_FILTER:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.POSITION +
      PREFIX +
      MOD_FUNC.METHOD.GETALL_FILTER,
    CREATE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.POSITION +
      PREFIX +
      MOD_FUNC.METHOD.CREATE,
    EDIT:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.POSITION +
      PREFIX +
      MOD_FUNC.METHOD.EDIT,
    DELETE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.POSITION +
      PREFIX +
      MOD_FUNC.METHOD.DELETE,
    READ:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.POSITION +
      PREFIX +
      MOD_FUNC.METHOD.READ,
    SEARCH:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.POSITION +
      PREFIX +
      MOD_FUNC.METHOD.SEARCH,
  },
  ROLE: {
    GETALL:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ROLE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL,
    GETALL_FILTER:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ROLE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL_FILTER,
    GETUSERROLE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ROLE +
      PREFIX +
      MOD_FUNC.METHOD.GETUSERROLE,
    CREATE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ROLE +
      PREFIX +
      MOD_FUNC.METHOD.CREATE,
    EDIT:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ROLE +
      PREFIX +
      MOD_FUNC.METHOD.EDIT,
    DELETE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ROLE +
      PREFIX +
      MOD_FUNC.METHOD.DELETE,
    READ:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ROLE +
      PREFIX +
      MOD_FUNC.METHOD.READ,
    SEARCH:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ROLE +
      PREFIX +
      MOD_FUNC.METHOD.SEARCH,
  },
  AUTHORIZE: {
    GET_ROLE_PERMISSION:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.AUTHORIZE +
      PREFIX +
      MOD_FUNC.METHOD.GET_ROLE_PERMISSION,
    GETALL:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.AUTHORIZE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL,
    GETALL_FILTER:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.AUTHORIZE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL_FILTER,
    CREATE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.AUTHORIZE +
      PREFIX +
      MOD_FUNC.METHOD.CREATE,
    EDIT:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.AUTHORIZE +
      PREFIX +
      MOD_FUNC.METHOD.EDIT,
    DELETE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.AUTHORIZE +
      PREFIX +
      MOD_FUNC.METHOD.DELETE,
    READ:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.AUTHORIZE +
      PREFIX +
      MOD_FUNC.METHOD.READ,
    SET:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.AUTHORIZE +
      PREFIX +
      MOD_FUNC.METHOD.SET,
  },
  FILE: {
    GETALL:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.FILE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL,
    GETALL_FILTER:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.FILE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL_FILTER,
    GETAUTHOR:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.FILE +
      PREFIX +
      MOD_FUNC.METHOD.GETAUTHOR,
    GETSOURCE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.FILE +
      PREFIX +
      MOD_FUNC.METHOD.GETSOURCE,
    CREATE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.FILE +
      PREFIX +
      MOD_FUNC.METHOD.CREATE,
    EDIT:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.FILE +
      PREFIX +
      MOD_FUNC.METHOD.EDIT,
    DELETE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.FILE +
      PREFIX +
      MOD_FUNC.METHOD.DELETE,
    READ:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.FILE +
      PREFIX +
      MOD_FUNC.METHOD.READ,
    SEARCH:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.FILE +
      PREFIX +
      MOD_FUNC.METHOD.SEARCH,
  },
  ARTICLE: {
    GETALL:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ARTICLE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL,
    GETALL_FILTER:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ARTICLE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL_FILTER,
    GETAUTHOR:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ARTICLE +
      PREFIX +
      MOD_FUNC.METHOD.GETAUTHOR,
    GETSOURCE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ARTICLE +
      PREFIX +
      MOD_FUNC.METHOD.GETSOURCE,
    CREATE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ARTICLE +
      PREFIX +
      MOD_FUNC.METHOD.CREATE,
    EDIT:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ARTICLE +
      PREFIX +
      MOD_FUNC.METHOD.EDIT,
    DELETE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ARTICLE +
      PREFIX +
      MOD_FUNC.METHOD.DELETE,
    READ:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ARTICLE +
      PREFIX +
      MOD_FUNC.METHOD.READ,
    SEARCH:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ARTICLE +
      PREFIX +
      MOD_FUNC.METHOD.SEARCH,
  },
  CHANNEL: {
    GETALL:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.CHANNEL +
      PREFIX +
      MOD_FUNC.METHOD.GETALL,
    GETALL_FILTER:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.CHANNEL +
      PREFIX +
      MOD_FUNC.METHOD.GETALL_FILTER,
    GETTREE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.CHANNEL +
      PREFIX +
      MOD_FUNC.METHOD.GETTREE,
    CREATE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.CHANNEL +
      PREFIX +
      MOD_FUNC.METHOD.CREATE,
    EDIT:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.CHANNEL +
      PREFIX +
      MOD_FUNC.METHOD.EDIT,
    DELETE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.CHANNEL +
      PREFIX +
      MOD_FUNC.METHOD.DELETE,
    READ:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.CHANNEL +
      PREFIX +
      MOD_FUNC.METHOD.READ,
    SEARCH:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.CHANNEL +
      PREFIX +
      MOD_FUNC.METHOD.SEARCH,
  },
  ARTICLETYPE: {
    GETALL:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ARTICLETYPE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL,
    GETALL_FILTER:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ARTICLETYPE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL_FILTER,
    CREATE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ARTICLETYPE +
      PREFIX +
      MOD_FUNC.METHOD.CREATE,
    EDIT:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ARTICLETYPE +
      PREFIX +
      MOD_FUNC.METHOD.EDIT,
    DELETE:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ARTICLETYPE +
      PREFIX +
      MOD_FUNC.METHOD.DELETE,
    READ:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ARTICLETYPE +
      PREFIX +
      MOD_FUNC.METHOD.READ,
    SEARCH:
      API_URL +
      PREFIX +
      MOD.ADMIN +
      PREFIX +
      MOD_FUNC.ARTICLETYPE +
      PREFIX +
      MOD_FUNC.METHOD.SEARCH,
  },
  ROOM: {
    //Schedule area
    TOKEN:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.ROOM +
      PREFIX +
      MOD_FUNC.METHOD.TOKEN,
    TEST_TOKEN:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.ROOM +
      PREFIX +
      MOD_FUNC.METHOD.TEST_TOKEN,
  },
  SCHEDULE: {
    GETALL:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL,
    GETALL_FILTER:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL_FILTER,
    GETALL_DELETED:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL_DELETED,
    GETBY_PERSONAL_ID:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.GETBY_PERSONAL_ID,
    GETOTHERBY_PERSONAL_ID:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.GETOTHERBY_PERSONAL_ID,
    GETBY_ORGAN_ID:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.GETBY_ORGAN_ID,
    CREATE:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.CREATE,
    EDIT:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.EDIT,
    UPDATE_START:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.UPDATE_START,
    DELETE:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.DELETE,
    DELETE_MANY:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.DELETE_MANY,
    RESTORE:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.RESTORE,
    RESTORE_MANY:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.RESTORE_MANY,
    REMOVE:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.REMOVE,
    REMOVE_MANY:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.REMOVE_MANY,
    READ:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.READ,
    READ_BY_NAME:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.GETBY_NAME,
    SEARCH:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.SEARCH,
  },
  SCHEDULEMEMBER: {
    GETALL:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL,
    GETALL_FILTER:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.GETALL_FILTER,
    GETBY_ID:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.GETBY_ID,
    CREATE:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.CREATE,
    DELETE:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.DELETE,
    READ:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.READ,
    SEARCH:
      API_URL +
      PREFIX +
      MOD.MEETING +
      PREFIX +
      MOD_FUNC.SCHEDULE +
      PREFIX +
      MOD_FUNC.METHOD.SEARCH,
  },
  MEETING_: {
    MAIL: {
      GETALL:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SENDMAIL +
        PREFIX +
        MOD_FUNC.METHOD.GETALL,
      GETALL_FILTER:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SENDMAIL +
        PREFIX +
        MOD_FUNC.METHOD.GETALL_FILTER,
      GETBY_ID:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SENDMAIL +
        PREFIX +
        MOD_FUNC.METHOD.READ,
      CREATE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SENDMAIL +
        PREFIX +
        MOD_FUNC.METHOD.CREATE,
      REMOVE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SENDMAIL +
        PREFIX +
        MOD_FUNC.METHOD.REMOVE,
      EDIT:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SENDMAIL +
        PREFIX +
        MOD_FUNC.METHOD.EDIT,
      SENDMAIL:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SENDMAIL +
        PREFIX +
        MOD_FUNC.METHOD.SENDMAIL,
    },
    CHAT: {
      GETBY_SCHEDULE_ID:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_CHAT +
        PREFIX +
        MOD_FUNC.METHOD.GETBY_SCHEDULE_ID,
      CREATE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_CHAT +
        PREFIX +
        MOD_FUNC.METHOD.CREATE,
    },
    CONSLUSION: {
      CREATE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_CONSLUSION +
        PREFIX +
        MOD_FUNC.METHOD.CREATE,
    },
    CONTENT: {
      GETBY_SCHEDULE_ID:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_CONTENT +
        PREFIX +
        MOD_FUNC.METHOD.GETBY_SCHEDULE_ID,
      GETBY_ID:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_CONTENT +
        PREFIX +
        MOD_FUNC.METHOD.READ,
      CREATE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_CONTENT +
        PREFIX +
        MOD_FUNC.METHOD.CREATE,
      REMOVE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_CONTENT +
        PREFIX +
        MOD_FUNC.METHOD.REMOVE,
      EDIT:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_CONTENT +
        PREFIX +
        MOD_FUNC.METHOD.EDIT,
    },
    DOCUMENT: {
      GETBY_SCHEDULE_ID:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_DOCUMENT +
        PREFIX +
        MOD_FUNC.METHOD.GETBY_SCHEDULE_ID,
      CREATE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_DOCUMENT +
        PREFIX +
        MOD_FUNC.METHOD.CREATE,
      REMOVE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_DOCUMENT +
        PREFIX +
        MOD_FUNC.METHOD.REMOVE,
      UPLOAD:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_DOCUMENT +
        PREFIX +
        MOD_FUNC.METHOD.UPLOAD,
    },
    MEMBER: {
      GETBY_SCHEDULE_ID:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_MEMBER +
        PREFIX +
        MOD_FUNC.METHOD.GETBY_SCHEDULE_ID,
      GETBY_SCHEDULE_ID_INSIDE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_MEMBER +
        PREFIX +
        MOD_FUNC.METHOD.GETBY_SCHEDULE_ID +
        MOD_FUNC.METHOD.INSIDE,
      GETBY_SCHEDULE_ID_OUTSIDE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_MEMBER +
        PREFIX +
        MOD_FUNC.METHOD.GETBY_SCHEDULE_ID +
        MOD_FUNC.METHOD.OUTSIDE,
      CREATE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_MEMBER +
        PREFIX +
        MOD_FUNC.METHOD.CREATE,
      REMOVE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_MEMBER +
        PREFIX +
        MOD_FUNC.METHOD.REMOVE,
    },
    SCHEDULE: {
      GETALL:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SCHEDULE +
        PREFIX +
        MOD_FUNC.METHOD.GETALL,
      GETBY_ID:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SCHEDULE +
        PREFIX +
        MOD_FUNC.METHOD.READ,
      GETBY_TITLE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SCHEDULE +
        PREFIX +
        MOD_FUNC.METHOD.GETBY_TITLE,
      GETBY_USERID:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SCHEDULE +
        PREFIX +
        MOD_FUNC.METHOD.GETBY_USERID,
      GETBY_USERID_DAY:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SCHEDULE +
        PREFIX +
        MOD_FUNC.METHOD.GETBY_USERID_DAY,
      GETBY_ROOMNAME:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SCHEDULE +
        PREFIX +
        MOD_FUNC.METHOD.ROOMNAME,
      GETALL_DELETED:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SCHEDULE +
        PREFIX +
        MOD_FUNC.METHOD.GET_ALL_DELETED,
      CREATE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SCHEDULE +
        PREFIX +
        MOD_FUNC.METHOD.CREATE,
      DELETE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SCHEDULE +
        PREFIX +
        MOD_FUNC.METHOD.DELETE,
      REMOVE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SCHEDULE +
        PREFIX +
        MOD_FUNC.METHOD.REMOVE,
      RESTORE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SCHEDULE +
        PREFIX +
        MOD_FUNC.METHOD.RESTORE,
      EDIT:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SCHEDULE +
        PREFIX +
        MOD_FUNC.METHOD.EDIT,
      EDIT_PASSWORD:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SCHEDULE +
        PREFIX +
        MOD_FUNC.METHOD.EDIT_PASSWORD,
      SHAREROLE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SCHEDULE +
        PREFIX +
        MOD_FUNC.METHOD.SHAREROLE,
      STATUS:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SCHEDULE +
        PREFIX +
        MOD_FUNC.METHOD.STATUS,
      START:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SCHEDULE +
        PREFIX +
        MOD_FUNC.METHOD.START,
      ISPUBLISHED:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SCHEDULE +
        PREFIX +
        MOD_FUNC.METHOD.ISPUBLISHED,
    },
    TYPE: {
      GETALL:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_TYPE +
        PREFIX +
        MOD_FUNC.METHOD.GETALL,
      GETBY_ID:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_TYPE +
        PREFIX +
        MOD_FUNC.METHOD.READ,
      CREATE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_TYPE +
        PREFIX +
        MOD_FUNC.METHOD.CREATE,
      REMOVE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_TYPE +
        PREFIX +
        MOD_FUNC.METHOD.REMOVE,
      EDIT:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_TYPE +
        PREFIX +
        MOD_FUNC.METHOD.EDIT,
    },
    SERVER: {
      GETALL:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SERVER +
        PREFIX +
        MOD_FUNC.METHOD.GETALL,
      GETALL_FILTER:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SERVER +
        PREFIX +
        MOD_FUNC.METHOD.GETALL_FILTER,
      GETBY_ID:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SERVER +
        PREFIX +
        MOD_FUNC.METHOD.READ,
      CREATE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SERVER +
        PREFIX +
        MOD_FUNC.METHOD.CREATE,
      REMOVE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SERVER +
        PREFIX +
        MOD_FUNC.METHOD.REMOVE,
      EDIT:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SERVER +
        PREFIX +
        MOD_FUNC.METHOD.EDIT,
      GETBYDEFAULT:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_SERVER +
        PREFIX +
        MOD_FUNC.METHOD.GETBYDEFAULT,
    },
    VIDEO: {
      CREATE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_VIDEO +
        PREFIX +
        MOD_FUNC.METHOD.CREATE,
    },
    VOTED: {
      GETBY_SCHEDULE_ID:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_VOTED +
        PREFIX +
        MOD_FUNC.METHOD.GETBY_SCHEDULE_ID,
      GETBY_VOTE_ID:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_VOTED +
        PREFIX +
        MOD_FUNC.METHOD.GETBY_VOTE_ID,
      GETBY_VOTEID_VOTETITLE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_VOTED +
        PREFIX +
        MOD_FUNC.METHOD.GETBY_VOTEID_VOTETITLE,
      CREATE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_VOTED +
        PREFIX +
        MOD_FUNC.METHOD.CREATE,
      REMOVE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_VOTED +
        PREFIX +
        MOD_FUNC.METHOD.REMOVE,
      EDIT:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_VOTED +
        PREFIX +
        MOD_FUNC.METHOD.EDIT,
    },
    VOTES: {
      GETBY_ID:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_VOTES +
        PREFIX +
        MOD_FUNC.METHOD.READ,
      GETBY_TITLE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_VOTES +
        PREFIX +
        MOD_FUNC.METHOD.GETBY_TITLE,
      GETBY_SCHEDULE_ID:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_VOTES +
        PREFIX +
        MOD_FUNC.METHOD.GETBY_SCHEDULE_ID,
      CREATE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_VOTES +
        PREFIX +
        MOD_FUNC.METHOD.CREATE,
      REMOVE:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_VOTES +
        PREFIX +
        MOD_FUNC.METHOD.REMOVE,
      EDIT:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_VOTES +
        PREFIX +
        MOD_FUNC.METHOD.EDIT,
      STATUS:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_VOTES +
        PREFIX +
        MOD_FUNC.METHOD.STATUS,
      END:
        API_URL +
        PREFIX +
        MOD.MEETING +
        PREFIX +
        MOD_FUNC.MEETING_VOTES +
        PREFIX +
        MOD_FUNC.METHOD.END,
    },
  },
};
