import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeaves } from "@/hooks/api/leaves/use-leaves";
import { useUser } from "@/hooks/api/user/use-user";
import { addDays, format, isWithinInterval, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, PlusIcon } from "lucide-react";
import { useState } from "react";
import { pl } from "date-fns/locale/pl";
import { useSchedules } from "@/hooks/api/schedules/use-schedules";
import { useScheduleContext } from "@/screens/employee/contexts/employee-schedule-context";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useDeleteSchedule } from "@/hooks/api/schedules/use-delete-schedule";
import { toast } from "@/components/ui/use-toast";

const getCurrentWeek = () => {
  const currentWeek = [];
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  for (let i = 0; i < 7; i++) {
    currentWeek.push(addDays(start, i));
  }
  return currentWeek;
};

const getNextWeek = (currentWeek: Date[]) => {
  const nextWeek = [];
  const start = startOfWeek(currentWeek[0], { weekStartsOn: 1 });
  for (let i = 0; i < 7; i++) {
    nextWeek.push(addDays(start, i + 7));
  }
  return nextWeek;
};

const getPreviousWeek = (currentWeek: Date[]) => {
  const previousWeek = [];
  const start = startOfWeek(currentWeek[0], { weekStartsOn: 1 });
  for (let i = 0; i < 7; i++) {
    previousWeek.push(addDays(start, i - 7));
  }
  return previousWeek;
};

export enum EventType {
  WORK = "WORK",
  VACATION = "VACATION",
  SICK_LEAVE = "SICK_LEAVE",
}

const TYPE_NAME = {
  WORK: "Praca",
  SICK_LEAVE: "Zwolnienie lekarskie",
  VACATION: "Urlop",
};

const TYPE_BACKGROUND = {
  WORK: "bg-primary",
  SICK_LEAVE: "bg-red-500",
  VACATION: "bg-blue-500",
};

type Props = {
  userId?: string;
  showNameInHeader?: boolean;
  canEdit?: boolean;
};

export const EmployeeSchedule: React.FC<Props> = ({
  userId,
  showNameInHeader,
  canEdit,
}) => {
  const { openModal: openScheduleModal } = useScheduleContext();
  const { mutate: deleteSchedule } = useDeleteSchedule();
  const { data: user } = useUser();
  const [week, setWeek] = useState(getCurrentWeek());
  const { data: leaves } = useLeaves({
    pagination: { pageIndex: 0, pageSize: 10 },
    date_from: week[0],
    date_to: week[6],
    userId,
    state: "APPROVED",
  });
  const { data: schedules } = useSchedules({
    pagination: { pageIndex: 0, pageSize: 10 },
    date_from: week[0],
    date_to: week[6],
    userId,
  });

  const handleDeleteSchedule = (id: number) => {
    const confirmResult = confirm(`Czy na pewno chcesz usunąć grafik?`);

    if (!confirmResult) {
      return;
    }

    deleteSchedule(
      {
        id: id,
      },
      {
        onSuccess: () => {
          toast({
            title: `Pomyślnie usunięto grafik`,
            variant: "default",
            duration: 2000,
          });
        },
        onError: () => {
          toast({
            title: "Wystąpił błąd podczas edycji grafiku",
            variant: "destructive",
            duration: 2000,
          });
        },
      }
    );
  };

  return (
    <div className="h-full flex flex-col">
      <Card className=" flex flex-col flex-grow">
        <CardHeader>
          <CardTitle className="flex flex-row justify-between">
            {showNameInHeader ? (
              <span>
                {user?.name} {user?.surname}
              </span>
            ) : (
              <span>Grafik</span>
            )}
            <div className="flex flex-row items-center gap-4">
              <Button
                className="p-2"
                variant="ghost"
                onClick={() =>
                  setWeek((currentWeek) => getPreviousWeek(currentWeek))
                }
              >
                <ChevronLeft />
              </Button>
              <span className="text-sm">
                {format(week[0].toDateString(), "dd.MM.yyyy")} -{" "}
                {format(week[6].toDateString(), "dd.MM.yyyy")}
              </span>
              <Button
                className="p-2"
                variant="ghost"
                onClick={() =>
                  setWeek((currentWeek) => getNextWeek(currentWeek))
                }
              >
                <ChevronRight />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-1">
          <div className="grid grid-cols-7 grid-flow-col flex-1">
            {week.map((weekday, i) => {
              const leavesWithinRange = leaves?.data.filter((event) => {
                return isWithinInterval(weekday, {
                  start: event.attributes.date_from,
                  end: event.attributes.date_to,
                });
              });
              const schedulesWithinRange = schedules?.data.filter((event) => {
                return isWithinInterval(weekday, {
                  start: event.attributes.date_from,
                  end: event.attributes.date_to,
                });
              });

              return (
                <div
                  key={weekday.toISOString()}
                  className={`flex flex-col gap-4 p-2 ${
                    i < 6 ? "border-r" : ""
                  }`}
                >
                  <div className="">
                    <span className="text-sm font-semibold">
                      {format(weekday, "EE", { locale: pl })}
                    </span>
                    <span className="text-xs text-opacity-10">
                      {" "}
                      {format(weekday, "dd.MM")}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {leavesWithinRange?.map((event) => {
                      return (
                        <Card className="bg-background">
                          <CardHeader className="px-2 py-2">
                            <CardTitle className="text-sm px-0 mx-0">
                              {TYPE_NAME[event.attributes.type]}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-2">
                            <div className="flex justify-between">
                              <div
                                className={`h-4 w-4 rounded-sm ${
                                  TYPE_BACKGROUND[event.attributes.type]
                                }`}
                              ></div>
                              <div className="text-xs font-bold">
                                Cały dzień
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    {schedulesWithinRange?.map((event) => {
                      return (
                        <ContextMenu key={event.id}>
                          <ContextMenuTrigger asChild disabled={!canEdit}>
                            <Card className="bg-background">
                              <CardHeader className="px-2 py-2">
                                <CardTitle className="text-sm px-0 mx-0">
                                  {TYPE_NAME[event.attributes.type]}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-2">
                                <div className="flex justify-between">
                                  <div
                                    className={`h-4 w-4 rounded-sm ${
                                      TYPE_BACKGROUND[event.attributes.type]
                                    }`}
                                  ></div>
                                  <div className="text-xs font-bold">8-16</div>
                                </div>
                              </CardContent>
                            </Card>
                          </ContextMenuTrigger>
                          <ContextMenuContent className="w-64">
                            <ContextMenuItem
                              onClick={() => openScheduleModal("edit", event)}
                            >
                              Edytuj
                            </ContextMenuItem>
                            <ContextMenuItem
                              onClick={() => handleDeleteSchedule(event.id)}
                            >
                              Usuń
                            </ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>
                      );
                    })}
                  </div>
                  {canEdit && (
                    <div className="">
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => openScheduleModal("create")}
                      >
                        <PlusIcon />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex gap-2">
          <div className="bg-primary h-4 w-4 rounded-sm"></div>
          <div className="text-xs font-semibold">Praca</div>
        </div>
        <div className="flex gap-2">
          <div className="bg-red-500 h-4 w-4 rounded-sm"></div>
          <div className="text-xs font-semibold">Zwolnienie lekarskie</div>
        </div>
        <div className="flex gap-2">
          <div className="bg-blue-500 h-4 w-4 rounded-sm"></div>
          <div className="text-xs font-semibold">Urlop</div>
        </div>
      </div>
    </div>
  );
};
