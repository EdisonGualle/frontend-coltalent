import React from "react";
import { CardHeader, Typography } from "@material-tailwind/react";
import PersonalData from "./PersonalData";
import UserData from "./UserData";
const Setting = () => {

    return (
        <>
            <CardHeader floated={false} shadow={false} className="rounded-none mt-0">
                <div className="mb-2 flex items-center justify-between gap-8">
                    <Typography variant="h4" color="blue-gray" className="font-semibold">
                        Configuración
                    </Typography>
                </div>
            </CardHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-11">
                <div>
                <PersonalData />
                </div>
                <div>
                <UserData />
                </div>
            </div>
        </>
    );
};

export default Setting;