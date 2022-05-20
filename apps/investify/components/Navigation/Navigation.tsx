import { Dispatch, SetStateAction } from 'react';
import { TemplateIcon, UsersIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  AnimatePresence,
  motion,
  PanInfo,
  useMotionValue,
  Variants,
} from 'framer-motion';
import classNames from '../../utils/classnames';
import { zeroPad } from 'ethers/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: TemplateIcon },
  { name: 'Discover', href: '/discover', icon: UsersIcon },
];

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const sidebarVariants = {
  visible: {
    width: 180,
    x: 0,
    opacity: 1,
  },
  hidden: {
    width: 0,
    x: -180,
    opacity: 0,
    transition: { delay: 0, duration: 0.2 },
  },
};

export default function Navigation({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { pathname } = useRouter();
  const x = useMotionValue(0);
  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x < -120) {
      setOpen(false);
    }
    handleDrag(event, info);
  };

  const handleDrag = (event: any, info: PanInfo) => {
    if (info.offset.x > 0) {
      x.set(0);
    }
  };

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.aside
          animate={open ? 'visible' : 'hidden'}
          initial="hidden"
          exit="hidden"
          drag="x"
          variants={sidebarVariants}
          dragConstraints={{
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
          }}
          style={{ x }}
          dragElastic={0.8}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className="h-full w-[180px]"
        >
          <motion.div className="flex flex-col flex-grow pt-5 bg-background h-full">
            <div>
              <div className="flex-shrink-0 flex items-center px-4 overflow-hidden">
                {/* Image here */}
              </div>
              <div className="mt-5 flex-1 overflow-y-auto">
                <nav className="px-2 space-y-1 overflow-hidden">
                  <motion.ul
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {navigation.map((item) => (
                      <motion.li key={item.name} variants={itemVariants}>
                        <Link href={item.href} passHref>
                          <span
                            className={classNames(
                              item.href === pathname
                                ? 'text-primary cursor-default'
                                : 'text-gray-400 cursor-pointer hover:text-primary',
                              'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                            )}
                          >
                            <item.icon
                              className="mr-3 flex-shrink-0 h-6 w-6 text-primary"
                              aria-hidden="true"
                            />
                            {item.name}
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </nav>
              </div>
            </div>
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}