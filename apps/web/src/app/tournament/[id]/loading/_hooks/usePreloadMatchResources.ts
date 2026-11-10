import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { TOURNAMENT_STATUS } from '@/consts/tournament';

import { getTournament } from '../../_common/_apis/getTournament';
import matchBackground from '../../_common/_assets/match-background.jpg';
import { carmenSans } from '../../_common/_consts/font';
import { loadMatchImage } from '../../_common/_utils/loadMatchImage';

const PRIORITY_WAIT_MS = 8000;
const MAX_WAIT_MS = 15000;
const NON_IMAGE_STEP_COUNT = 3;

const usePreloadMatchResources = (tournamentId: number) => {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let isPriorityWaitOver = false;
    let isPriorityLoaded = false;
    let completedCount = 0;
    let totalCount = Number.POSITIVE_INFINITY;

    const completeOne = () => {
      completedCount += 1;
      if (!isCancelled) setProgress(completedCount / totalCount);
    };

    const finish = () => {
      if (isCancelled) return;
      clearTimeout(priorityWaitTimer);
      clearTimeout(maxWaitTimer);
      setIsComplete(true);
    };

    const priorityWaitTimer = setTimeout(() => {
      isPriorityWaitOver = true;
      if (isPriorityLoaded) finish();
    }, PRIORITY_WAIT_MS);
    const maxWaitTimer = setTimeout(finish, MAX_WAIT_MS);

    const getMatchImageUrls = async () => {
      try {
        const tournament = await queryClient.fetchQuery({
          queryKey: ['tournament', tournamentId],
          queryFn: () => getTournament(tournamentId),
          staleTime: 0,
        });
        if (tournament.status !== TOURNAMENT_STATUS.IN_PROGRESS || !tournament.inProgress) {
          return { firstMatchImageUrls: [], restImageUrls: [] };
        }

        const { currentMatch, remainingItems } = tournament.inProgress;
        const firstMatchImageUrls = [
          currentMatch?.first.imageUrl,
          currentMatch?.second.imageUrl,
        ].filter((url): url is string => !!url);
        const restImageUrls = remainingItems
          .map(item => item.imageUrl)
          .filter((url): url is string => !!url && !firstMatchImageUrls.includes(url));

        return { firstMatchImageUrls, restImageUrls };
      } catch {
        return { firstMatchImageUrls: [], restImageUrls: [] };
      }
    };

    const loadImages = (imageUrls: string[], fetchPriority: 'high' | 'low') =>
      Promise.all(imageUrls.map(url => loadMatchImage(url, fetchPriority).then(completeOne)));

    const imagesTask = getMatchImageUrls().then(({ firstMatchImageUrls, restImageUrls }) => {
      totalCount = NON_IMAGE_STEP_COUNT + firstMatchImageUrls.length + restImageUrls.length;
      completeOne();

      return {
        firstMatchTask: loadImages(firstMatchImageUrls, 'high'),
        restTask: loadImages(restImageUrls, 'low'),
      };
    });

    const fontTask = document.fonts
      .load(`700 1em ${carmenSans.style.fontFamily}`)
      .catch(() => null)
      .then(completeOne);

    const backgroundTask = new Promise<void>(resolve => {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = matchBackground.src;
    }).then(completeOne);

    const priorityTask = Promise.all([
      fontTask,
      backgroundTask,
      imagesTask.then(({ firstMatchTask }) => firstMatchTask),
    ]).then(() => {
      isPriorityLoaded = true;
      if (isPriorityWaitOver) finish();
    });

    Promise.all([priorityTask, imagesTask.then(({ restTask }) => restTask)]).then(finish);

    return () => {
      isCancelled = true;
      clearTimeout(priorityWaitTimer);
      clearTimeout(maxWaitTimer);
    };
  }, [queryClient, tournamentId]);

  return { progress, isComplete };
};

export default usePreloadMatchResources;
