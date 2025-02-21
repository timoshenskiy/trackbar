"use client";

import React, { useEffect, useState } from "react";
import { Collapse as ReactCollapse } from "react-collapse";
import dayjs from "dayjs";
import S from "./styles";
import { authSelector } from "./services/auth";
import { getAuth } from "./services/auth/actions";
import { useAppDispatch, useAppSelector } from "../../services/hooks";
import { CityInterface, AuthInterface } from "./services/auth/interface";

const TITLE = "Current city:";
const STATIC_DATA = {
  columns: {
    temperature: "Temperature",
    date: "Date",
    wind: "Wind",
  },
};

const Weather = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [currentCity, setCurrentCity] = useState(null);
  const dispatch = useAppDispatch();
  const { data: authData } = useAppSelector(authSelector);

  useEffect(() => {
    if (currentCity) {
      const { latitude, longitude }: CityInterface = currentCity;
      dispatch(getAuth(latitude, longitude));
    }
  }, [currentCity, dispatch]);

  return <S.Container>123456</S.Container>;
};

export default Weather;
